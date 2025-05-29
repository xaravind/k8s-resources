Docker Architecture consists of docker client which is command line tool, docker engine that is nothing but docker host, and the local registry and central registry. when ever you run a command in docker client , it will connect to the  daemon, it will check the image in local, if it is not available it will pull from cental registry and keep it in local and run a container from it and a send a request to the client.


Docker Problems
----
If container crashes, docker is not able to replace automatically --> Not Reliable, No self-healing
No proper volume management
no strong network connectivity
no auto scaling
no secrets and config management


Now are Building the image with docker but running images with docker
we are using k8s to run the container, it only responsible the to run the image build network, build volume 


Workstation
-------
ekctl --> to create and manage cluster
installation https://eksctl.io/installation/

kubectl --> to manage containers in k8s.
installation:- https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

eks.yml

```bash
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

to create eks-cluster

```bash
eksctl create cluster --config-file=<path> #to create cluster
eksctl delete cluster --config-file=<path> #to delete cluster
```

kubectl api-resources                  # Lists all available Kubernetes resources (currently around 63 by default)

kubectl get nodes                     # Displays the nodes in the Kubernetes cluster

kubectl create namespace <name>      # Creates a new namespace

kubectl delete namespace <name>      # Deletes an existing namespace

kubectl describe <resource> <name>   # Describes the specified Kubernetes resource

kubectl get ns                       # Lists all namespaces (shortcut for 'kubectl get namespaces')


k8 resources
------------
01.namespace ---> isolated project space where you can create resources related to your project

manifest file
-----


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

----

02.pod --> smallest deployable unit kubernetes
-----
pod vs containers
-------
a pod contains multiple containers. containers inside pod share same n/w and storage

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

kubectl exec -it <pod-name> -c <container-name> -- bash

Got it! Here's a simplified and consistent explanation of each Kubernetes concept without including YAML examples:

---

### 01. **Namespace**

A **namespace** is a virtual cluster within a Kubernetes cluster. It allows you to isolate and organize resources for different teams, environments, or projects.

✅ **Why we use it**:

* To separate environments like dev, test, and prod
* To apply different resource quotas or access permissions
* To avoid name collisions between resources in large clusters

---

### 02. **Pod**

A **pod** is the smallest deployable unit in Kubernetes. It can contain one or more containers that are tightly coupled and must run together.

✅ **Key Points**:

* All containers in a pod share the same **network** and **storage**
* Used to host a single application process or tightly related processes
* Managed by higher-level controllers like Deployments

---

### 03. **Multi-Container Pod**

A **multi-container pod** runs two or more containers in the same pod. These containers work together and can communicate over `localhost`.

✅ **Use Cases**:

* Sidecar containers (e.g., logging agent, proxy, cache)
* Adapter or helper processes that support the main container
* Containers that need to share volumes or communicate frequently

---

### 04. **Labels**

**Labels** are key-value metadata attached to Kubernetes objects. They are used to organize, group, and select resources.

✅ **Why we use them**:

* To filter and select resources using label selectors (e.g., in Services, Deployments)
* To group resources by app, environment, or role
* To manage resources dynamically (e.g., rolling updates)

---

### 05. **Annotations**

**Annotations** are also key-value metadata, but they store **non-identifying** information. Unlike labels, annotations are not used for selecting or filtering.

✅ **Why we use them**:

* To add documentation, tool-specific data, or config metadata
* To store monitoring or audit information
* To support integrations (e.g., with service meshes, CI/CD tools)


📌 **Key Difference from Labels**:

* Labels: Used by Kubernetes itself (selectors, groupings)

* Annotations: Used for tooling, documentation, and external systems
---

### 06. **Environment Variables**

Environment variables are used to pass dynamic values into containers from the pod specification.

✅ **Why we use them**:

* To configure applications at runtime (e.g., DB host, API keys)
* To keep container images reusable by externalizing configuration
* To inject values from ConfigMaps, Secrets, or inline definitions

once you create pod with env variables, log into pod check env

```bash
kubectl exec -it <pod-name> -- bash

root@env-test:/# env
practice=k8s
project=micro-services
practice=k8s
```
---
07-resources.yml
---

```bash
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




sidecar - container
-----
in general we use backend to push log to elasticsearch and handle the user request, it will additional workload to container 
so we use additional helper container(sidecar) to do the sidejobs.

log push contiainer is called fluentd ( it solo responsibilty to push logs)

elascticsearch --> aws service to use to store logs storage of cluster

Kubernetes Control Plane




the main **control plane components** in Kubernetes.

---

### 1. **kube-apiserver**

The kube-apiserver handles requests from kubectl or other tools. It validates and authenticates requests, communicates with other control plane components, and updates the desired state in etcd.
It acts as the front-end of the control plane and all API calls go through it.

---

### 2. **etcd**

etcd is a key-value store used to store all cluster data.
It stores the desired state of the Kubernetes cluster, such as node info, pod specs, and config maps.
It is the **source of truth** for the cluster.

---

### 3. **kube-scheduler**

The kube-scheduler watches for newly created pods that don’t have a node assigned.
It selects the best node for the pod to run based on factors like resource requirements, taints/tolerations, and affinity rules.

---

### 4. **kube-controller-manager**

The kube-controller-manager runs different controllers to handle background tasks.
Each controller watches the cluster state and tries to move it toward the desired state.

Some common controllers include:

* **Node Controller** – checks if nodes are healthy.
* **Replication Controller** – makes sure the right number of pod replicas are running.
* **Job Controller** – handles batch jobs.
* **Endpoints Controller** – manages endpoint objects.

---

### 5. **cloud-controller-manager**

This component interacts with the cloud provider (like AWS, GCP, or Azure).
It manages cloud-specific tasks, such as managing load balancers, storage volumes, and node information in the cloud.

---


**Kubernetes Node-Level Components**

---

### 1. **kubelet**

kubelet is an agent that runs on each node.
It ensures that containers are running as expected on that node.
It gets pod instructions from the kube-apiserver and reports the status of the node and its pods back to the control plane.

---

### 2. **kube-proxy**

kube-proxy runs on each node and manages network rules.
It helps route traffic to the correct pod across the cluster using IP tables or IPVS.
It allows communication between services and pods inside the cluster.

---

### 3. **Container Runtime**

The container runtime is the software that runs containers (like Docker, containerd, or CRI-O).
Kubelet uses the container runtime to start, stop, and manage containers on the node.

---