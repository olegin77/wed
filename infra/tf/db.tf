resource "digitalocean_database_cluster" "wt_db" {
  name       = "wt-db"
  engine     = "pg"
  version    = "15"
  size       = "db-s-1vcpu-1gb"
  region     = "fra1"
  node_count = 1
}
output "db_uri" { value = digitalocean_database_cluster.wt_db.uri }
