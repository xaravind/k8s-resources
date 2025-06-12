

## Docker Limitations

* **No built-in load balancing:** Docker does not natively support distributing traffic across multiple containers.
* **Lacks self-healing:** If a container crashes, Docker won’t automatically restart or replace it without additional tooling.
* **Limited volume management:** Docker provides basic volume capabilities but lacks advanced management features like dynamic provisioning or backups.
* **Simplistic networking:** Docker’s networking options are not robust enough for complex or enterprise-level scenarios without external tools.
* **No auto-scaling:** Docker alone cannot dynamically scale containers based on resource usage or traffic demand.
* **Weak secrets and configuration management:** Docker does not offer strong built-in support for managing sensitive data or application configurations securely.

---

Currently, we build container images with Docker but run them using Kubernetes (K8s). Kubernetes is responsible for running containers, managing network connectivity, handling volume mounts, and ensuring better orchestration and scalability.

---
## Kubernetes

Kubernetes is an open-source container orachestration platform for automating the deployment, scaling and management of containers or pods.

One major advantage of Kubernetes over Docker alone is its ability to run **containerized applications** across multiple virtual machines (VMs), enabling scalability and high availability.

## Kubernetes Architecture Overview

Kubernetes consists of:

* **Workstation:** Where you interact with the cluster (e.g., using `kubectl`).
* **Control Plane / Master Node:** Manages the cluster state.
* **Worker Nodes:** Where containers (pods) run.

---

## Control Plane Components

1. **kube-apiserver**

The `kube-apiserver` is the **front-end** of the Kubernetes control plane. It acts as the **main entry point** for all cluster operations.


- Handles **REST API requests** from `kubectl`, internal components (scheduler, controllers), and external tools.
- Validates, authenticates, and authorizes requests.
- Communicates with **etcd**, the cluster’s source of truth.
- It is the only component that communicates directly with `etcd`, whereas all other control plane components access `etcd` indirectly through the API server.
- All communication between the user and the Kubernetes cluster **must go through the API server**.


---

2. **etcd**

`etcd` is a **distributed and consistent key-value store** that stores **all cluster data**.

- Holds the entire state of the cluster (nodes, pods, ConfigMaps, Secrets, etc.).
- If `etcd` fails, the control plane cannot function properly.
- Regular backups are critical—typically stored in **cloud storage** like Amazon S3.
---

3. **kube-scheduler**

The `kube-scheduler` assigns newly created pods to suitable nodes by evaluating:

- Available CPU, RAM, and storage
- Taints and tolerations
- Node selectors and affinities

---

4. **kube-controller-manager**

The `kube-controller-manager` ensures the **desired state** matches the **actual state** of the cluster. It runs multiple controllers:

#### Components:

- **Node Controller** – Detects and responds to node failures.
- **Replication Controller** – Ensures the correct number of pod replicas.
- **Job Controller** – Manages batch jobs and ensures completion.
- **Endpoints Controller** – Maintains service-to-pod endpoint mappings.


---

5. **cloud-controller-manager**

Integrates Kubernetes with **cloud provider APIs** (e.g., AWS, GCP, Azure).

#### Responsibilities:

- **Load Balancer Controller** – Provisions cloud load balancers.
- **Persistent Volume Controller** – Manages cloud storage volumes.
- **Node Lifecycle Controller** – Handles cloud-level node deletions or failures.
- **Route Controller** – (Optional) Configures cloud-specific network routes.

### 🔄 Comparison: `kube-controller-manager` vs `cloud-controller-manager`

| Feature                   | kube-controller-manager                                       | cloud-controller-manager                                            |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Purpose**               | Manages **cluster-level controllers** (generic to all setups) | Handles **cloud-provider-specific tasks**                           |
| **Runs Controllers Like** | Node, Replication, Job, Endpoints Controllers                 | Load Balancer, Persistent Volume, Node Lifecycle, Route Controllers |
| **Cloud Dependency**      | **Cloud-agnostic** (does not depend on cloud provider)        | **Cloud-dependent** (integrates with AWS, GCP, Azure, etc.)         |
| **Failure Impact**        | Affects cluster-level object management and state maintenance | Affects cloud resource provisioning and integration                 |
| **Extensibility**         | Limited to core Kubernetes objects                            | Pluggable per cloud provider, makes Kubernetes modular and portable |

---
## Node Components

### 1. `kubelet`

An agent running on each worker node that:

- Ensures pods are running as expected
- Reports node and pod health to the control plane
- Interacts with the container runtime

---

### 2. `kube-proxy`

Manages network rules and forwards traffic:

- Enables service-to-pod communication
- Uses `iptables`, `ipvs`, or `eBPF`
- Supports TCP, UDP, and SCTP load balancing

---

### 3. Container Runtime

The container runtime runs the actual containers. It:

- Pulls container images
- Starts, stops, and manages containers
- Works with `kubelet`

**Common runtimes:**  
- `containerd`  
- `CRI-O`  
- (Deprecated) `Docker`

---

## Summary

| Component                | Role                                                                 |
|--------------------------|----------------------------------------------------------------------|
| **kube-apiserver**       | Frontend for all control plane interactions                          |
| **etcd**                 | Stores entire cluster state                                           |
| **kube-scheduler**       | Assigns pods to suitable nodes                                       |
| **kube-controller-manager** | Reconciles desired vs actual state                                |
| **cloud-controller-manager** | Manages cloud integration                                       |
| **kubelet**              | Ensures containers are running on each node                          |
| **kube-proxy**           | Manages networking and load-balancing rules                          |
| **Container Runtime**    | Runs containers on nodes                                             |

---

## Installation and configuration of Kubernetes in workstation

### 1. **eksctl**

`eksctl` is a simple CLI tool used to create and manage Kubernetes clusters on Amazon EKS. It automates many cluster setup tasks and simplifies cluster management.

* **Installation:** Follow the instructions at [eksctl installation](https://eksctl.io/installation/).

* **Sample cluster config (eks.yml):**

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: expense
  region: us-east-1

managedNodeGroups:
- name: expense
  instanceType: m5.large
  desiredCapacity: 3
  spot: true
```

* **Commands:**

```bash
eksctl create cluster --config-file=<path-to-eks.yml>   # Create an EKS cluster
eksctl delete cluster --config-file=<path-to-eks.yml>   # Delete the EKS cluster
```

---

### 2. **kubectl**

`kubectl` is the Kubernetes CLI tool used to interact with and manage Kubernetes clusters, pods, services, and other resources.

* **Installation:** Follow instructions at [AWS EKS kubectl guide](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html).

* **Common commands:**

```bash
kubectl api-resources                  # List all available Kubernetes resource types

kubectl get nodes                      # Display all nodes in the cluster

kubectl create namespace <name>       # Create a new namespace

kubectl delete namespace <name>       # Delete an existing namespace

kubectl describe <resource> <name>    # Show detailed info about a specific resource

kubectl get ns                        # Shortcut to list all namespaces
```

---


Your notes on **Kubernetes Resources** are very well-structured, practical, and easy to follow — especially for beginners and intermediate users. You've explained key concepts using examples, best practices, and clear YAML snippets. Well done!

---

### ✅ Feedback Summary

#### **Strengths:**

* 🔹 **Clarity**: Definitions are clear and concise.
* 🔹 **Real-world relevance**: Practical examples and command-line instructions are excellent.
* 🔹 **Structure**: Organized with bullet points, headings, and markdown styling that makes it easy to read.
* 🔹 **Best practices**: Great that you're including these for each resource — very helpful!

---




## k8s-resources


## What Are Kubernetes Resources?

In Kubernetes, **resources** are the building blocks used to deploy, manage, and scale applications. These include objects like **pods, services, deployments, config maps, secrets**, and more.

Each resource serves a specific role in defining the **desired state** of your application and the **infrastructure logic** needed to support it.

### 1. **Namespace**

A **Namespace** is a way to **divide a Kubernetes cluster into isolated environments**. Think of it as a separate workspace where you can group related resources like pods, services, and deployments.

- Isolated Project where you can create resources to related to your project.

---

✅ **Why we use Namespaces**:

* To **separate teams or projects** within the same cluster
* To apply **different access controls, quotas, or policies**
* To avoid **name conflicts** across environments (e.g., `dev`, `test`, `prod`)

---

📌 **Best Practices**:

* Use namespaces for logical separation of concerns
* Apply **resource limits and RBAC rules** per namespace
* Avoid using the default namespace for production workloads

example manifest file to create namespace
```bash
Kind: Namespace
apiVersion: v1
metadata:
    name: project
    labels:
        name: project
        environment: dev
```

kubectl apply -f <file.yml> # to create k8s resources

kubectl delete -f <file.yml> # to delete k8s resources

---

### 2. **Pod**

A **Pod** is the **smallest deployable unit** in Kubernetes. It represents a single instance of a running process in a cluster.

---

✅ **Key Features**:

* A pod typically runs **one container**, but it can run multiple if needed
* All containers in a pod share the **same network IP and storage**
* Pods are **short-lived** and usually managed by controllers like Deployments

---

example manifest file to create pod
```bash
Kind: pod
apiVersion: v1
metadata: 
    name: nginx
spec:
    containers:
    - name: nginx
      image: nginx
```

kubectl apply -f <pod.yml>

kubectl describe pod <pod-name> # to see pod info

---

### 3. **Multi-Container Pod**

A **multi-container pod** runs two or more containers in the same pod.These containers work together and can communicate over `localhost`.

---

✅ **Why We Use Multi-Container Pods**

* To create **sidecar containers** for logging, monitoring, or proxying
* To run **helper processes** alongside the main application
* To **share files and memory** via shared volumes
* To use **init containers** for startup tasks like waiting for dependencies, setting up config files, or initializing volumes before the main container starts
* ⚙️ **Workload separation** allows auxiliary tasks—such as log forwarding, data synchronization, or certificate renewal—to run in separate containers, keeping the **main container focused on its core responsibilities** (e.g., handling API requests)

🔹 *Example*: A sidecar like **Fluentd** can handle log shipping, offloading that task from the backend container, which improves performance and maintains separation of concerns.

---

###  Sidecar Container

In Kubernetes, a **sidecar container** runs alongside the main application container within the same pod to handle supporting tasks.

For example, rather than having the backend container push logs—which adds unnecessary load—we deploy a sidecar like **Fluentd** to collect and forward logs.

**Fluentd** then sends logs to **Elasticsearch**, our centralized logging solution. Since Elasticsearch is managed via **AWS**, we benefit from scalable and reliable log storage without burdening application containers.

This approach enhances **performance**, improves **observability**, and supports **separation of concerns** within our microservices architecture.

---

###  Init Container

An **init container** in Kubernetes runs **before** the main application container starts. It performs **preparation tasks** that must succeed before the app begins execution.

For instance, if the application depends on a service like a database, the init container can run a script to **wait for the database to become available** or to **initialize configuration files or shared volumes**.

By handling such setup logic outside the main container, we:

* Improve **startup reliability**
* Keep application code simpler
* Enforce a consistent **startup sequence**

---

📌 **Best Practices**:

* Use multi-container pods **only when containers must work together**
* Use **init containers** for setup tasks before main containers start
* Design containers to be loosely coupled and independently replaceable when possible

---

03.multi-containers.yml
```bash
Kind: pod
apiVersion: v1
metadata: 
    name: multi-container
spec:
    containers:
    - name: nginx
      image: nginx
    - name: alma
      image: "almalinux:9"
      command: ["sleep", "2000"]
```

kubectl apply -f multi-containers.yml

kubectl exec -it <pod-name> -c <container-name> -- bash   # Access a specific container in a pod

---

### 4. **Labels**

**Labels** are **key-value pairs** used to **organize and identify** Kubernetes resources.

> Labels are mandatory in Kubernetes as they help services identify which pods they belong to and which ones they should target.

---

✅ **Why we use Labels**:

* To group resources logically (e.g., `app=frontend`, `env=prod`)
* To **select resources** for services, deployments, and policies
* To filter and manage resources using `kubectl` or tools like Helm

---

📌 **Best Practices**:

* Define consistent label naming conventions (e.g., `app`, `tier`, `version`)
* Use labels to enable **rolling updates**, monitoring, and scaling
* Avoid putting sensitive or unique data in labels


**sample manifest files, uploaded in below github repo**
https://github.com/xaravind/k8s-resources.git

---

### 5. **Annotations**

**Annotations** are also **key-value metadata**, but they store **non-identifying information** about Kubernetes objects.

---

✅ **Why we use Annotations**:

* To attach **descriptive or operational data** (e.g., build info, monitoring configs)
* To support **external tools and integrations** (e.g., Ingress controllers, CI/CD)
* To provide context or configuration **without affecting selection or grouping**


---

📌 **Best Practices**:

* Use annotations for **metadata that shouldn’t affect behavior**
* Avoid storing sensitive data (use Secrets instead)
* Use standardized annotation keys where possible (e.g., `kubectl.kubernetes.io/last-applied-configuration`)

**sample manifest files, uploaded in below github repo**
https://github.com/xaravind/k8s-resources.git

---

### 6. **Environment Variables**

**Environment variables** are used to **inject configuration values** into containers at runtime.

---

✅ **Why we use Environment Variables**:

* To configure applications **without modifying code or images**
* To provide settings like **database URLs, feature flags, or API keys**
* To make containers **portable across environments**

---

📌 **Best Practices**:

* Use them for simple values (e.g., strings, paths, ports)
* Store values in **ConfigMaps or Secrets** and reference them in pods
* Avoid hardcoding credentials—use Secrets for sensitive info

---

**sample manifest file**
```bash
Kind: pod
apiVersion: v1
metadata: 
    name: labels
    labels:
      author: aravind
      project : k8s
spec:
    containers:
    - name: nginx
      image: nginx
```

once you create pod with env variables, log into pod check env

```bash
kubectl exec -it <pod-name> -- bash

root@env-test:/# env
practice=k8s
project=micro-services
practice=k8s
```
---
### 07. **Resources**

In Kubernetes, **resources** refer to the **compute limits and requests** (CPU and memory) assigned to containers within a pod.

> In Kubernetes, resource requests specify the minimum CPU and memory required for a pod to be scheduled on a node, while resource limits define the maximum CPU and memory the pod can use on that node.

---

✅ **Why we use them**:

* To **prevent a container from using too many resources** and affecting others on the same node
* To **schedule containers efficiently** based on available node capacity
* To **enforce stability and fairness** in multi-tenant environments

---

 **Types of Resource Settings**:

1. **Requests**

   * Minimum amount of CPU or memory **guaranteed** to the container
   * Kubernetes uses this to decide **where to schedule** the pod
   * If resources are tight, a pod may not be scheduled unless its request can be met

2. **Limits**

   * The **maximum amount** of CPU or memory a container is allowed to use
   * If a container exceeds its memory limit, it will be **terminated (OOMKilled)**
   * CPU overuse can be **throttled**, not killed

---

 **How to determine appropriate values**:

* **Start with baseline usage**: Monitor your app locally or in test environments
* Use Kubernetes tools like:

* `kubectl top pod` (CPU/memory usage)
* Metrics server, Prometheus, or Datadog
* Gradually tune **requests and limits** based on observed behavior
* Set conservative defaults, then adjust as needed to avoid underutilization or crashes

**sample manifest file**
```bash
kind: Pod
apiVersion: v1
metadata:
  name: project
  labels:
    name: project
    environment: dev
spec:
  containers:
  - name: app
    image: nginx
    resources:
      # soft limit
      requests:
        memory: "64Mi"
        cpu: "250m" # 1 cpu = 1000m
      # limits should be atleast same or more than requests i.e hard limit
      limits:
        memory: "128Mi"
        cpu: "500m"
```


---
### 08. **ConfigMaps**

A **ConfigMap** is a Kubernetes object used to **store configuration data** (key-value pairs) separately from application code. This allows you to **inject dynamic configuration** into your containers **without rebuilding images**.

**sample manifest file**
configMap.yml
```bash
Kind: pod
apiVersion: v1
metadata: 
    name: labels
    labels:
      author: aravind
      project : k8s
spec:
    containers:
    - name: nginx
      image: ngiapiVersion: v1
kind: ConfigMap
metadata:
  name: project
data:
  github: "https://github.com/xaravind/k8s-resources.git"
  db: "jdbc:mysql://mysql:3306/sample"
```

Pod-configMap.yml
```bash
apiVersion: v1
Kind: pod 
metadata:
  name: pod-config
spec:
  containers:
  - name: app
    image: nginx
  envFrom: # to refer all values at once in configmaps
  - configMapKeyRef:
    name: project
  # env:
  # # to refer single values
  # - name: db
  #   valueFrom:
  #     configMapKeyRef:
  #       name: project # The ConfigMap name this value comes from.
  #       key: db #  The key to fetch.
   
```

---

✅ **Why we use ConfigMaps**:

* To **externalize app configuration** (e.g., URLs, feature flags, file paths)
* To keep containers **environment-agnostic**
* To **manage changes** to app settings without restarting or redeploying images
* To **reuse configurations** across multiple pods or deployments

---

 **Common ways to use ConfigMaps**:

1. **As environment variables** in a container
2. **Mounted as files** inside a container (useful for config files)
3. Accessed programmatically via Kubernetes API (advanced use cases)

---

📌 **Best Practices**:

* Use ConfigMaps for **non-sensitive data** only (use Secrets for sensitive info)
* Combine with **Deployment strategies** to roll out config changes
* Keep your ConfigMaps under version control (e.g., as YAML files in Git)
---

kubectl get configmap # to list configmaps

kubectl describe configmap <configmap-name> # to show the details

### 09. **Secrets**

A **Secret** in Kubernetes is used to store **sensitive data** such as passwords, API keys, tokens, or certificates. Like ConfigMaps, Secrets decouple configuration from your application code — but with **added security**.

---

✅ **Why we use Secrets**:

* To **securely store and manage sensitive information**
* To avoid hardcoding secrets in container images or configuration files
* To **inject secrets into pods** via environment variables or mounted volumes
* To support **TLS, authentication, and encrypted credentials** management

---

 **Key Features**:

* Secrets are **base64-encoded** in etcd (not encrypted by default, but can be with encryption-at-rest)
* They are only shared with pods that need them
* Kubernetes RBAC controls who can access Secrets

---

 **Common use cases**:

* Database credentials
* SSH keys or TLS certificates
* Access tokens for external services (e.g., AWS, GitHub)

---

📌 **Best Practices**:

* Use Secrets **only for confidential data**
* Enable **encryption at rest** for etcd on your cluster
* Limit access with **RBAC policies**
* Avoid printing or logging secrets accidentally
* Use tools like **Sealed Secrets, HashiCorp Vault**, or **external secret stores** for advanced secret management



**sample manifest files**
secrets.yml
```bash
apiVersion: v1
kind: Secret
metadata:
  name: pod-secret
data:
  username: "YWRtaW4K" # echo admin | base64
  password: "YWRtaW4xMjMK" #echo admin123 | base64
```

pod-secrets.yml
```bash
apiVersion: v1
kind: Pod
metadata:
  name: pod-secrets
spec:
  containers:
  - name: nginx
    image: nginx
    envFrom:
    - secretRef:
        name: pod-secret
```

---

### 10. **Services**

A **Service** is a stable way to expose a set of pods to other services or external users.

---

✅ **Why we use Services**:

* To give pods a **stable DNS name and IP** despite changing pod IPs
* To enable **load balancing** across multiple pods
* To control **how traffic reaches the application**


**sample manifest files**

pod-service.yml

```bash
apiVersion: v1
kind: pod
metadata:
  name: nginx
  labels:
    name: frontend
    environment: dev
spec:
  containers:
    - name: app-nginx
      image: nginx
```
kubectl apply -f pod-service.yml

service.yml
```bash
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    name: frontend
    environment: dev
  ports:
  - port: 80 # service port
    targetPort: 80 # target port
```

kubectl apply -f service.yml
kubectl get service
kubectl describe service nginx 
---

### 10.1 **NodePort**

* Exposes the service on a **static port** on each node's IP
* Accessible from **outside the cluster** via `NodeIP:NodePort`
* ⚠️ Less flexible and secure for production

---

### 10.2 **ClusterIP(default)**

* Default service type
* Exposes the service **internally** within the cluster
* Ideal for **service-to-service** communication

---

### 10.3 **LoadBalancer**

* Provisions an **external load balancer** (cloud-dependent)
* Exposes service to **external traffic** using a **public IP**
* Ideal for **internet-facing applications**

---

### 11. **ReplicaSet**

A **ReplicaSet** ensures that a specified number of **pod replicas** are always running.

---

✅ **Why we use ReplicaSets**:

* To maintain **high availability** and **scalability**
* To **automatically replace failed or terminated pods**
* Forms the foundation for **Deployments**

---

📌 **Best Practices**:

* Don’t use ReplicaSet directly—use **Deployments** which manage ReplicaSets
* Scale up/down using the Deployment for better control
* Monitor pod health and replica status regularly

---

### 12. **Deployment**

A **Deployment** is a higher-level Kubernetes object that manages ReplicaSets and provides **declarative updates** to applications.

---

✅ **Why we use Deployments**:

* To **automate rollout and rollback** of application versions
* To **scale applications up or down** easily
* To ensure **desired state** by managing ReplicaSets under the hood

---

📌 **Key Features**:

* Supports **rolling updates** to avoid downtime
* Automatically **replaces unhealthy pods**
* Enables **version history tracking and rollback**

---

📌 **Best Practices**:

* Define `strategy` (e.g., `RollingUpdate`) for controlled updates
* Always **version your container images** (avoid `latest`)
* Use probes (`readinessProbe`, `livenessProbe`) for better control over rollout behavior

---

### 🔚 **End Section (Relationship between Pod, ReplicaSet, Deployment, and Service)**

```markdown
---

## 🔄 How Pod, ReplicaSet, Deployment, and Service Work Together

A typical application deployment in Kubernetes follows this flow:

1. **Pod**  
   - The smallest unit that runs your container.
   - It can be manually created but is not recommended for production.

2. **ReplicaSet**  
   - Ensures the desired number of pods are always running.
   - Automatically replaces failed pods.
   - Can be used directly but usually managed by a Deployment.

3. **Deployment**  
   - Manages ReplicaSets and handles rollout/rollback strategies.
   - The recommended way to manage stateless apps in Kubernetes.

4. **Service**  
   - Provides a stable endpoint to expose your pods (via selectors).
   - Ensures traffic is distributed across healthy pod replicas.

### ✅ Real-World Flow:
You define a **Deployment** → it creates and manages a **ReplicaSet** → which ensures multiple copies of a **Pod** → these pods are exposed using a **Service**.

This architecture ensures **resilience**, **scalability**, and **reliable communication** between components in your application.
```

---


### 13. **StatefulSet**

A **StatefulSet** manages the deployment of **stateful applications**, ensuring each pod has a **stable identity**, **persistent storage**, and **ordered deployment**.

---

✅ **Why we use StatefulSets**:

* For apps that need **stable hostnames** (e.g., databases like MySQL, Cassandra)
* To ensure **ordered startup/shutdown** and consistent storage
* To maintain **sticky identity** across pod restarts

---

📌 **Key Features**:

* Pods get **unique, persistent identities** (`pod-0`, `pod-1`, etc.)
* Supports **volume claim templates** for persistent storage
* Ordered pod deployment and scaling

---

📌 **Best Practices**:

* Use **Headless Services** for network identity
* Combine with **PersistentVolumeClaims** for durable storage
* Avoid using StatefulSets unless app truly requires state

---

### 14. **DaemonSet**

A **DaemonSet** ensures that a **copy of a pod runs on every node** (or a specific group of nodes) in the cluster.

---

✅ **Why we use DaemonSets**:

* For **node-level tasks** like logging, monitoring, or networking agents
* To ensure **system-critical services** run on all nodes
* To deploy pods on **new nodes automatically**

---

📌 **Key Features**:

* Pods are created on **every node** in the cluster
* Automatically schedules pods on **newly added nodes**
* Can target **specific node groups** using selectors

---

📌 **Best Practices**:

* Use for **infrastructure-level workloads**
* Combine with **tolerations** and **nodeSelectors** for targeting
* Avoid scheduling too many resource-heavy pods

---
Here's the continuation in the same format for **Jobs**, **CronJobs**, and **Ingress**:

---

### 15. **Job**

A **Job** creates one or more pods to **run a task to completion**. Once the task finishes successfully, the job is marked as complete.

---

✅ **Why we use Jobs**:

* To run **one-time tasks** like database migrations or batch processing
* To **ensure completion** of critical background operations
* To retry failed tasks a **specified number of times**

---

📌 **Key Features**:

* Automatically **retries failed pods** based on the policy
* Runs until the **success criteria** is met
* Can run **parallel** or **sequential** pods

---

📌 **Best Practices**:

* Set `backoffLimit` to control retries
* Use `ttlSecondsAfterFinished` to clean up old jobs
* Monitor job completion with `kubectl get jobs`

---

### 16. **CronJob**

A **CronJob** runs Jobs **on a time-based schedule**, like Linux cron jobs.

---

✅ **Why we use CronJobs**:

* To run **recurring tasks** (e.g., backups, reports, cleanups)
* For **time-driven automation** in Kubernetes
* To replace external cron-based systems

---

📌 **Key Features**:

* Uses standard cron syntax (`* * * * *`)
* Automatically creates Jobs on schedule
* Supports `startingDeadlineSeconds`, `concurrencyPolicy`, etc.

---

📌 **Best Practices**:

* Set a `successfulJobsHistoryLimit` to avoid clutter
* Use `concurrencyPolicy: Forbid` or `Replace` for overlapping runs
* Avoid over-scheduling — ensure the job completes before the next run

---

### 17. **Ingress**

An **Ingress** is a Kubernetes object that manages **external access to services**, typically HTTP/HTTPS, using **rules**.

---

✅ **Why we use Ingress**:

* To expose multiple services under a **single IP or domain**
* To provide **path-based** or **host-based** routing
* To apply **SSL/TLS termination** and **authentication**

---

📌 **Key Features**:

* Uses an **Ingress Controller** (e.g., NGINX, Traefik)
* Supports advanced **routing, redirects, and rewrites**
* Integrates with **TLS certificates** for HTTPS

---

📌 **Best Practices**:

* Always install a reliable Ingress Controller
* Secure routes with TLS and authentication
* Use annotations for custom behavior (timeouts, rewrites, etc.)

---
### 18. **NetworkPolicy**

A **NetworkPolicy** defines how **pods communicate** with each other and with external endpoints at the **network level**.

---

✅ **Why we use NetworkPolicies**:

* To **secure pod-to-pod traffic**
* To restrict access to/from **namespaces, IPs, or ports**
* To enforce **zero-trust networking** in Kubernetes

---

📌 **Key Features**:

* Controls **inbound and outbound traffic**
* Supports rules based on **pod labels, namespaces, IP blocks**
* Works only if a **network plugin** (like Calico or Cilium) supports it

---

📌 **Best Practices**:

* Start with **default deny all** policy
* Apply **least privilege** communication rules
* Document traffic flow to avoid accidental blocking

---

### 19. **Custom Resource (CR)**

A **Custom Resource (CR)** is an extension of Kubernetes API that allows you to **define and manage your own object types**.

---

✅ **Why we use Custom Resources**:

* To support **domain-specific workflows** (e.g., databases, ML pipelines)
* To add **new behavior or automation** with Kubernetes-native integration
* To build **custom controllers** for managing CRs

---

📌 **Key Features**:

* Defined via **CustomResourceDefinition (CRD)**
* Managed like native Kubernetes objects (`kubectl get <crd>`)
* Can be paired with a **Controller** (operator pattern)

---

📌 **Best Practices**:

* Follow Kubernetes object structure for compatibility
* Use CRDs only when core resources aren't sufficient
* Validate CRs with **OpenAPI schemas** in CRD definitions

---