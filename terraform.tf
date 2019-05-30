terraform {
  backend "remote" {
    organization = "aliem"

    workspaces {
      name = "aliemu"
    }
  }
}

output "droplet_name" {
  value = module.digitalocean_web.name
}

output "droplet_ip" {
  value = module.digitalocean_web.ipv4_address
}

output "droplet_region" {
  value = module.digitalocean_web.region
}

variable "do_token" {
  description = "DigitalOcean Access Token."
}

variable "cf_token" {
  description = "Cloudflare API Key."
}

locals {
  domain = "aliemu.com"
}

provider "cloudflare" {
  version = "~> 1.15"

  email = "mlin@aliem.com"
  token = var.cf_token
}

provider "digitalocean" {
  version = "~> 1.4.0"

  token = var.do_token
}

module "digitalocean_web" {
  source = "github.com/aliemteam/infrastructure//compute/digitalocean/wordpress"

  domain = local.domain
  image  = "docker-18-04"
}

module "cloudflare_dns" {
  source = "github.com/aliemteam/infrastructure//networking/cloudflare/dns"

  domain       = local.domain
  ipv4_address = module.digitalocean_web.ipv4_address
}

