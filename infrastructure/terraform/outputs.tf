
output "instructions" {
  value = <<-EOT
    
    ✅ Terraform deployment complete!
    
    To access the application:
    1. Get frontend URL:
       minikube service frontend -n ${kubernetes_namespace.monitoring.metadata[0].name} --url
    
    2. Port forward backend:
       kubectl port-forward -n ${kubernetes_namespace.monitoring.metadata[0].name} service/backend 8000:8000
    
    3. View all resources:
       kubectl get all -n ${kubernetes_namespace.monitoring.metadata[0].name}
    
    4. View dashboard:
       minikube dashboard
  EOT
}