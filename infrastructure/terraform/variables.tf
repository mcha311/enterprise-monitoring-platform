variable "namespace" {
  description = "Kubernetes namespace"
  type        = string
  default     = "monitoring-tf"
}

variable "mysql_root_password" {
  description = "MySQL root password"
  type        = string
  default     = "rootpassword"
  sensitive   = true
}

variable "replicas" {
  description = "Number of replicas for backend and frontend"
  type        = number
  default     = 2
}