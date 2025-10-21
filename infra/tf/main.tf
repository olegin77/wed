terraform {
  required_providers { digitalocean = { source = "digitalocean/digitalocean" } }
  required_version = ">= 1.6.0"
}
provider "digitalocean" {
  token = var.do_token
}
variable "do_token" { type = string }
