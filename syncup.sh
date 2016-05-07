#!/bin/bash

###
# COMANDS
# 'get uploads' = retrieve all uploads that do not already exist
# 'get plugin [plugin-name]' = retrieve and overwrite the plugin [plugin-name]
# 'get --all-plugins' = retrieve all paid plugins (REQUIRED BEFORE RUNNING ENVIRONMENT)
# 'get database' = retrieve a copy of the database from the server + rename urls
# 'update plugin [plugin-name] = update a specific plugin'

# Globals
SCRIPTDIR=$(dirname "$0")
PaidPlugins=(learndash-propanel sfwd-lms um-profile-completeness)

# Collect the FTP password, exit if it doesn't exist
if [ -f ./data/ftp_pass ]; then
    FTPpass=$(cat ./data/ftp_pass)
else
    echo '=> Error: You must have the file "ftp_pass" located within your data directory'
    exit 0
fi

# Exit if the DSA file doesn't exist
if [ ! -f ./data/aliemu_dsa ]; then
    echo '=> Error: You must have the file "aliemu_dsa" located within your data directory'
    exit 0
fi

# OS-specific variables
if [[ $(uname) == "Linux" ]]; then
  ONLINUX=true
  CONTAINER_IP="localhost"
else
  ONLINUX=false
  CONTAINER_IP=$(docker-machine ip "$DOCKER_MACHINE_NAME")
fi

cd "$SCRIPTDIR" || exit

case "$1" in

    get)

        case "$2" in

            uploads)

                cd "$SCRIPTDIR/wp-content" || exit
                echo "=> Downloading uploads from server..."
                wget -rq -nH --cut-dirs=1 -l inf --no-clobber ftp://ftp.aliemu.com/wp-content/uploads/ --ftp-user=dsifford@aliemu.com --ftp-password="$FTPpass"
                echo "=> Uploads Synced Successfully!"
                ;;

            --all-plugins)

                cd "$SCRIPTDIR/wp-content/plugins" || exit
                for plugin in "${PaidPlugins[@]}"; do
                    echo "=> Retrieving plugin: $plugin"
                    wget -m -nH --cut-dirs=2 ftp://ftp.aliemu.com/wp-content/plugins/"$plugin" --ftp-user=dsifford@aliemu.com --ftp-password="$FTPpass"
                    echo "=> Plugin $plugin Retrieved Successfully!"
                done
                ;;

            plugin)

                cd "$SCRIPTDIR/wp-content/plugins" || exit
                echo "=> Retrieving plugin: $3"
                wget -m -nH --cut-dirs=2 ftp://ftp.aliemu.com/wp-content/plugins/"$3" --ftp-user=dsifford@aliemu.com --ftp-password="$FTPpass"
                echo "=> Plugin $3 Retrieved Successfully!"
                ;;

            database)

                # Ensure we are in the script's directory
                cd "$SCRIPTDIR/data" || exit

                # Ensure proper file permissions
                chmod 400 aliemu_dsa

                # Run ssh-agent and add the ssh private key
                eval "$(ssh-agent -s)"
                ssh-add aliemu_dsa

                # SSH into siteground and backup the database and copy to the data directory
                if [[ $ONLINUX == true ]]; then
                    ssh -i aliemu_dsa aliemu@c7563.sgvps.net -p 18765 "
                    cd public_html
                    wp db export database.sql"
                    scp -i aliemu_dsa -P 18765 aliemu@c7563.sgvps.net:public_html/database.sql .
                else
                    ssh -i aliemu_dsa aliemu@c7563.sgvps.net -p 18765 -o "PubkeyAcceptedKeyTypes ssh-dss" "
                    cd public_html
                    wp db export database.sql"
                    scp -i aliemu_dsa -P 18765 -o "PubkeyAcceptedKeyTypes ssh-dss" aliemu@c7563.sgvps.net:public_html/database.sql .

                    # Machine not running? Start it up!
                    if [[ $(docker-machine status "$DOCKER_MACHINE_NAME") != 'Running' ]]; then
                        cd "$SCRIPTDIR" || exit
                        docker-compose up -d
                    fi
                fi

                # Import the database
                echo "=> Importing database..."
                docker exec -it "$(docker ps -lq)" bash -c "wp db import /data/database.sql --allow-root"

                # Replace live URL with dev URL
                echo "=> Replacing URLs..."
                docker exec -it "$(docker ps -lq)" bash -c "wp search-replace  'http://www.aliemu.com' 'http://${CONTAINER_IP}:8080' --skip-columns=guid --allow-root"
                echo "=> Database Successfully Imported!"
                ;;

            *)
                echo "'get' subcommmand must be either 'uploads', 'plugin', '--all-plugins', or 'database'"
                exit 1
        esac
        ;;

    update)

        case "$2" in

            plugin)

                echo "=> Updating plugin: $3"
                PLUGIN=$3
                docker exec -it "$(docker ps -lq)" bash -c "wp plugin install $PLUGIN --force --activate --allow-root"
                ;;

            *)
                echo "'update' subcommand must be 'plugin'"
                exit 1
        esac
        ;;

    *)
        echo "The only commands available are 'get' and 'update'"
        exit 1
esac
