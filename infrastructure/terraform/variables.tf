# Project Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "hoops-platform"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# AWS Configuration
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "hoops_platform"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "hoops_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Cache Configuration
variable "cache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

# ECS Configuration
variable "api_cpu" {
  description = "CPU units for API service"
  type        = number
  default     = 256
}

variable "api_memory" {
  description = "Memory for API service"
  type        = number
  default     = 512
}

variable "web_cpu" {
  description = "CPU units for Web service"
  type        = number
  default     = 256
}

variable "web_memory" {
  description = "Memory for Web service"
  type        = number
  default     = 512
}

# Common Tags
variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project   = "hoops-platform"
    CreatedBy = "terraform"
  }
} 