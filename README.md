# Steps to run

- [Steps to run](#steps-to-run)
  - [Description](#description)
  - [NOTE](#note)
  - [Steps - AWS](#steps---aws)
    - [1. Cluster](#1-cluster)
    - [2. Worker Nodes](#2-worker-nodes)
    - [3. Setting EKS as our docker context](#3-setting-eks-as-our-docker-context)
  - [Adding EFS Volume using CSI](#adding-efs-volume-using-csi)
    - [Steps](#steps)
  - [Steps to run - Locally](#steps-to-run---locally)

## Description

- Creating and running in Kubernetes Cluster
- Creates EC2 instances behind the scene
- We do not even need to make a load balancer
- AWS creates LoadBalancer if we define it on deployment files
- Load balancer URL can be found using `kubectl get service` and look for service with loadbalancer

## NOTE

- Do not run in Dev container
- Installing aws-cli in devcontainer will give error `Unknown options: eks,update-kubeconfig`

## Steps - AWS

### 1. Cluster

1. AWS -> Swervices -> EKSs
2. Create Cluster
3. Enter the data
   1. Name
   2. Version
   3. Create and apply necessary roles (GUI provides all detai about this)
4. Next
5. Create a VPC for EKS
   1. Create a stack
   2. In Template paste https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml
      - Latest template can be found at the link https://docs.aws.amazon.com/eks/latest/userguide/create-public-private-vpc.html#create-vpc 
   3. Next
   4. Give the tsack a name eg. `eks-vpc-stack`
   5. Leave all default and create
6. In drop down select the newly created VPC
7. Endpoint access - `Public and Private`
8. Next
9. Leave all defualt and create

### 2. Worker Nodes

1. Services -> EKS -> Select Cluster 
2. Compute -> Add node group (Can be found in bottom buttons)
3. Enter name
4. Enter role
   1. Create a role 
   2. Select AWS Entity -> Next
   3. Select `AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy`, `AmazonEC2ContainerRegistryReadOnly` Policy
   4. Leave al option as default
   5. Create
5. Next
6. Specify the type of instance `t3.small` (t3.micro will not work)
7. Leave node as default (2)
8. Next
9. Optional (Uncheck: Enable remote access - Will prevent accessing pods using ssh)
10. Next
11. Create

- **TODO** Search for a way to check pod resource usage in EKS
- `kubectl top pods` doesnt work

### 3. Setting EKS as our docker context 

- **NOTE** Run next steps from Windows instead of devcontainer as AWS CLI is required even with `kubectl` which is not available in devcontainer

1. Donwload AWS CLI from `https://aws.amazon.com/cli/`
2. Install it
3. Go to IAM -> Create Acess key
4. Download the access key
5. Enter `aws configure`
   1. Enter ID, Secret key (From previous step), region (EKS region - Can be found in top right of aws console)
6. `aws eks --region us-east-2 update-kubeconfig --name k8s-eks-node` Update Kubeconfig file at `C:\Users\<Username>\.kube\config`
7. Run all files `kubectl apply -f .`

## Adding EFS Volume using CSI

- Visit [link](https://github.com/kubernetes-sigs/aws-efs-csi-driver) for more info
- CSI driver is required because EFS is not natively supported by Kubernetes

### Steps

1. Run the command `kubectl apply -k "github.com/kubernetes-sigs/aws-efs-csi-driver/deploy/kubernetes/overlays/stable/?ref=release-1.0"` to setful CSI for EFS
2. Create security group
   1. Go to Services -> EC2
   2. Create ecurity Group
   3. Select your EKS VPPC
   4. Add Inbound rule for `NFS`
   5. Source Anywhere OR (Services -> VPC -> VPC -> Select EKS VPC -> Look for IPv4 CIDR -> COPY the IP and paste)
3. Go to Services -> EFS -> Create
   1. Enter name and selct EKS VPC
   2. Remove default secutiy groups from subnet and specify the ones created in previous step
   3. Create
4. Create a persistentn volume deployment with `Storage CLass`, `PersistentVolume`, `PersistentVolumeClaim`
5. Add volume support in user depl


## Steps to run - Locally

1. Make sure k8s/users-pv.yml code is commented
2. Make sure users.yaml code related to volumes is commented
3. `kubectl apply -f .`
