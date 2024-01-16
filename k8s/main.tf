provider "google" {
  credentials = file("csci-5409-2-35be6a617687.json")
  project     = "csci-5409-2"
  region      = "us-central1"
}

resource "google_container_cluster" "k8-cluster" {
  name               = "k8s-cluster"
  location           = "us-central1-a"
  initial_node_count = 1

  node_config {
    machine_type = "e2-medium"
  }
}
