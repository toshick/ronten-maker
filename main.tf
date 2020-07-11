
variable "docker_declaration" {
  type = string
  # gcr.io/ronten-maker/app3
  # gcr.io/ronten-maker/ronten-maker
  default = "spec:\n  containers:\n    - name: ronron-name\n      image: 'gcr.io/ronten-maker/ronten-maker'\n      stdin: false\n      tty: false\n  restartPolicy: Always\n"
}


provider "google" {
  credentials = file("credentials/ronten-maker-f7c980a9afeb.json")
  project     = "ronten-maker"
  region      = "asia-northeast1"
}

resource "google_compute_address" "static" {
  name         = "ipv4-address"
  region       = "asia-northeast1"
  network_tier = "PREMIUM"
}

# インスタンス設定
resource "google_compute_instance" "apps-gcp-terraform" {

  name         = "ronten-maker-terraform"
  machine_type = "f1-micro" #f1-micro, g1-small
  zone         = "asia-northeast1-b"
  boot_disk {
    auto_delete = true # インスタンス削除時にディスクも削除するか
    initialize_params {
      size  = 10 #ディスクサイズ(GB)
      type  = "pd-standard"
      image = "cos-cloud/cos-stable" //osの image
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.static.address
    }
  }

  metadata = {
    gce-container-declaration = "${var.docker_declaration}"
  }
  # VMインスタンスのファイアウォールのところ（valueはきっとファイアウォール画面のtarget名）
  tags = ["http-server"]

  service_account {
    email  = "ronten-maker2@ronten-maker.iam.gserviceaccount.com"
    scopes = ["cloud-platform"]
  }
}

# VPCネットワーク内のファイアウォールアイテムを追加する
# resource "google_compute_firewall" "http-8080" {
#   name    = "http-8080"
#   network = "${data.google_compute_network.default.name}"

#   allow {
#     protocol = "tcp"
#     ports    = ["${var.port_number}"]
#   }
# }



