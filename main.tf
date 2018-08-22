variable "do_token" {
  description = "DigitalOcean Access Token."
}

variable "cf_token" {
  description = "Cloudflare Global API Key."
}

terraform {
  backend "local" {
    path = "lib/terraform.tfstate"
  }
}

locals {
  domain = "aliemu.com"
}

provider "cloudflare" {
  version = "~> 1.1"

  email = "dereksifford@gmail.com"
  token = "${var.cf_token}"
}

provider "digitalocean" {
  version = "~> 0.1"

  token = "${var.do_token}"
}

module "digitalocean_web" {
  source = "github.com/aliemteam/infrastructure//compute/digitalocean/wordpress"

  domain = "${local.domain}"
}

module "cloudflare_dns" {
  source = "github.com/aliemteam/infrastructure//networking/cloudflare/dns"

  domain       = "${local.domain}"
  ipv4_address = "${module.digitalocean_web.ipv4_address}"
}
