resource "digitalocean_spaces_bucket" "wt_media" {
  name   = "wt-media"
  region = "ams3"
  acl    = "public-read"
}
output "spaces_name" { value = digitalocean_spaces_bucket.wt_media.name }
