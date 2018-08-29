#!/usr/bin/env bash
# shellcheck disable=SC1091
USAGE='
Usage:
	sync.sh (push | pull) [-dptu] [--project NAME] [--theme NAME]
	sync.sh (push | pull) (-a | --all) [--project NAME] [--theme NAME]
	sync.sh (-h | --help)

Options:
	-a, --all       Shorthand for -dpu.
	-d, --database  Sync database.
	-p, --plugins   Sync plugins.
	-u, --uploads   Sync uploads.
	-h, --help      Display usage and exit.

	--project NAME  Override the default project name.
	--theme   NAME  Sync parent theme NAME.
'

# shellcheck disable=SC2154
if [[ -z $npm_package_name ]]; then
	echo 'Script must be ran using npm'
	exit 1
fi

for cmd in rsync getopt; do
	command -v "$cmd" > /dev/null || {
		echo '---------------------------------------------------------'
		echo "ERROR: Must have '$cmd' installed and avalable in PATH"
		echo '---------------------------------------------------------'
		exit 1
	}
done

if ! OPTS=$(getopt -o 'adpuh' -l 'all,database,plugins,project:,theme:,uploads,help' -n 'sync.sh' -- "$@"); then
	exit 1
fi
eval set -- "$OPTS"
unset OPTS

declare -i all=0
declare -i database=0
declare -i plugins=0
declare -i theme=0
declare -i uploads=0
declare parent_theme=
declare project_name="$npm_package_name"

while true; do
	case "$1" in
		-a | --all)
			all=1
			shift
			;;
		-d | --database)
			database=1
			shift
			;;
		-p | --plugins)
			plugins=1
			shift
			;;
		--project)
			project_name="$2"
			shift 2
			;;
		--theme)
			theme=1
			parent_theme="$2"
			shift 2
			;;
		-u | --uploads)
			uploads=1
			shift
			;;
		-h | --help)
			echo "$USAGE"
			exit
			;;
		--)
			shift
			break
			;;
		*)
			exit 1
			;;
	esac
done

if [ $# -eq 0 ]; then
	echo '-----------------------------------------------------------------'
	echo 'ERROR: First positional argument must be either "push" or "pull".'
	echo '-----------------------------------------------------------------'
	exit 1
fi

main() {
	#{{{
	set -e
	source ./.env

	SERVER_IP="${SERVER_IP?SERVER_IP not defined in .env file}"

	if ! ssh -q root@"$SERVER_IP" exit; then
		cat <<- EOF
			You either don't have permissions to access this server via SSH or passwordless ssh isn't configured properly on your machine.

			Be sure that your ~/.ssh/config file has a wildcard pattern set like the following:

			Host *
			    IgnoreUnknown UseKeychain
			    AddKeysToAgent yes
			    IdentityFile ~/.ssh/id_rsa
			    UseKeychain yes
		EOF
		exit 1
	fi

	declare src_base=
	declare dest_base=
	declare operation_verb=

	while (($#)); do
		case "$1" in
			push)
				shift
				src_base="$PWD"
				dest_base="root@$SERVER_IP:/app"
				operation_verb='Deploying'
				;;
			pull)
				shift
				src_base="root@$SERVER_IP:/app"
				dest_base="$PWD"
				operation_verb='Syncing'
				mkdir -p ./{data,wp-content/{themes,plugins,uploads}}
				;;

			*)
				echo '------------------------------------------'
				echo "ERROR: Unknown positional argument '$1'"
				echo '------------------------------------------'
				exit 1
				;;
		esac
	done

	declare -i counter=0

	if ((all)); then
		sync_database
		sync_plugins
		sync_uploads
		if ((theme)); then
			sync_theme
		fi
		counter=$((counter + 1))
	else
		if ((database)); then
			sync_database
			counter=$((counter + 1))
		fi
		if ((plugins)); then
			sync_plugins
			counter=$((counter + 1))
		fi
		if ((theme)); then
			sync_theme
			counter=$((counter + 1))
		fi
		if ((uploads)); then
			sync_uploads
			counter=$((counter + 1))
		fi
	fi

	if ! ((counter)) && [ "$dest_base" == "$PWD" ]; then
		sync_database
		sync_uploads
	fi

	sync_project
	#}}}
}

sync_database() {
	#{{{
	echo "==> $operation_verb database..."

	touch ./data/database.sql.bak
	touch ./data/database.sql
	mv ./data/database.sql.bak ./data/database.sql.old.bak
	mv ./data/database.sql ./data/database.sql.bak

	ssh root@"$SERVER_IP" '
		cd /app &&
		docker-compose exec -T wordpress bash -c '\''
			sudo chown -R $(whoami):$(whoami) /data &&
			wp db export /data/database.sql
		'\''
	'

	rsync -avz --no-owner --no-perms \
		root@"$SERVER_IP":/app/data/database.sql \
		"$PWD"/data/database.sql

	rm ./data/database.sql.old.bak
	#}}}
}

sync_plugins() {
	#{{{
	echo "==> $operation_verb plugins..."
	rsync -avz --no-owner --no-perms --delete \
		"$src_base"/wp-content/plugins/ \
		"$dest_base"/wp-content/plugins
	#}}}
}

sync_project() {
	#{{{
	if [ "$dest_base" == "$PWD" ]; then
		return
	fi

	echo '==> Building project.'
	npm run test
	npm run build

	echo "==> $operation_verb project files..."
	rsync -avz --no-owner --no-perms \
		"$src_base"/.env \
		"$dest_base"/.env

	rsync -avz --no-owner --no-perms \
		"$src_base"/lib/production.yml \
		"$dest_base"/docker-compose.override.yml

	rsync -avz --no-owner --no-perms \
		"$src_base"/docker-compose.yml \
		"$dest_base"/docker-compose.yml

	rsync -avz --no-owner --no-perms --delete \
		"$src_base"/dist/ \
		"$dest_base"/wp-content/themes/"$project_name"
	#}}}
}

sync_theme() {
	#{{{
	echo "==> $operation_verb parent theme..."
	rsync -avz --no-owner --no-perms --delete \
		"$src_base"/wp-content/themes/"$parent_theme" \
		"$dest_base"/wp-content/themes
	#}}}
}

sync_uploads() {
	#{{{
	echo "==> $operation_verb uploads..."
	rsync -avz --no-owner --no-perms --delete \
		"$src_base"/wp-content/uploads/ \
		"$dest_base"/wp-content/uploads
	#}}}
}

main "$@"

# vim: set fdm=marker:
