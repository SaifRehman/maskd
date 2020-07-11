<h1 align="center">
  <br>
  <a href="https://github.com/SaifRehman/maskd.git"><img src="https://1.cms.s81c.com/sites/default/files/2020-04/edgeapplication600x340.jpg.jpeg" alt="ACE"></a>
  <br>
      Mask Detection Demo on IBM Edge
  <br>
  <br>
</h1>

<p align="center" style="margin-top: 50px; font-weight: bold;"><b>Saif ur Rehman</b> (<a href="mailto:saif.ur.rehman@ibm.com" style="font-weight: normal">saif.ur.rehman@ibm.com</a>)</p>
<div style="page-break-after: always; break-after: page;"></div>
<br>

# Mask Detection Demo on IBM Edge

In this Repo I will walk you through on how you can build Face Mask detection demo on Raspberrypy deployed over ***IBM Edge Applocation Manager***

## High Level Architecture 

![1](images/1.png)

Tool used 

1. Raspberrypy as a edge hardware
2. IBM Edge Application Manager
3. Nodejs
4. Flatend
5. Openshift
6. Opencvjs
7. Cloud Annotations

Process workflow

1. Take sample images of you wearing a mask, and without masks. Take at least 200 picture with mask, 200 picture without wearing mask
2. Upload the picture to ***IBM Cloud Annotations*** and train 
3. Download the trained model and save it 
4. Deploy the edge application which takes live camera feed, and process the live camera feed through the trained model, and predict if the person is wearing mask or not. Deployment of application to raspberrypy is done by IBM Edge application manager
5. Deploy the gateway to Openshift that will listen to frames sent by raspberrypy and showcase the frames in FE

## Pre-Req

1. Have IBM Edge Application Manager installed 
2. Configure Rasbpberrypi and install RaspbianOS
3. Install Nodejs, Cloudctl, Docker in Raspberrypy
4. Have the trained model ready through Cloud Annotation 

## Training the model 

You can find an in depth walkthrough for training a TensorFlow.js model [here](https://github.com/cloud-annotations/training/).

## Deploy the gateway 

1. Login to your dockerhub

```
$ docker login
```

2. clone the repo 

```
$ https://github.com/SaifRehman/maskd.git
```
3. navigate to edge directory 

```
$ cd maskd/edge
```

4. Build the dockerfile

```
$ docker build -t edgegateway:v1
```

5. Tag the image 

```
$ docker tag edgegateway:v1 <usernname>/edgegateway:v1
```

6. Push the image

```
$ docker push  <usernname>/edgegateway:v1
```

7. Login to Openshift

8. Apply the K8 yaml to deploy the gateway

```
$ oc apply -f k8/
```

9. This will deploy the pod and create a service as loadbalancer. Please not the loadbalancer ip by this command 

```
$ oc get svc
```


## Configure Edge Device

### Install hzn cli in Raspberrypy

1. Navigate to directory ```ibm-ecm-4.0.0-x86_64``` directory. this directory was created when you untar/unzip the mcm package downloaded from passport advantage 

2. Choose the right operating system 
```
[root@karun-ocp-43-inf ibmedge]# ls -lart ibm-ecm-4.0.0-x86_64/horizon-edge-packages/linux/ubuntu
total 0
drwxr-xr-x 4 501 games 34 Feb  6 21:18 .
drwxr-xr-x 4 501 games 32 Feb  6 21:18 xenial
drwxr-xr-x 5 501 games 50 Feb  6 21:18 ..
drwxr-xr-x 4 501 games 32 Jun  9 06:32 bionic
```

```
[root@karun-ocp-43-inf ibmedge]# ls -lart ibm-ecm-4.0.0-x86_64/horizon-edge-packages/linux/ubuntu/xenial/amd64/
total 15964
-rw-r--r-- 1  501 games   37876 Feb  6 21:18 bluehorizon_2.24.18~ppa~ubuntu.xenial_all.deb
-rw-r--r-- 1  501 games 4835204 Feb  6 21:18 horizon-cli_2.24.18~ppa~ubuntu.xenial_amd64.deb
-rw-r--r-- 1  501 games 6044648 Feb  6 21:18 horizon_2.24.18~ppa~ubuntu.xenial_amd64.deb
drwxr-xr-x 4  501 games      32 Feb  6 21:18 ..
drwxr-xr-x 2  501 games     223 Jun  9 17:56 .
```

3. Copy each file from this host to where you would like to install ```hzn``` cli. Hint:- by using scp command

```
$ scp <user>@<ip>:ibm-ecm-4.0.0-x86_64/horizon-edge-packages/linux/ubuntu/xenial/amd64/bluehorizon_2.24.18~ppa~ubuntu.xenial_all.deb /local/dir
```
> copy all files 

4. Navigate to directory where u copied and run this command 

```
$ dpkg <filename>.deb /target
```

> Do it for all files names

5. Start ```horizon```

```
$ systemctl enable horizon
$ systemctl start horizon
$ systemctl status horizon
```

6. You will now have ```hzn``` cli installed 

### Connect edge devices 

1. Set the ICP_CLUSTER_URL environment variable. This value can be obtained from the output of the Management Hub install

```
$ export ICP_CLUSTER_URL=https://$(oc get routes -n kube-system icp-console -o jsonpath='{.spec.host}')
```

2. cloudctl login -a $CLUSTER_URL -u admin -p <your-icp-admin-password> -n kube-system --skip-ssl-validation

```
$ cloudctl login -a $CLUSTER_URL -u admin -p <your-icp-admin-password> -n kube-system --skip-ssl-validation
```

3. Export the following variables that are needed

```
$ export EXCHANGE_ROOT_PASS=$(oc -n kube-system get secret edge-computing -o jsonpath="{.data.exchange-config}" | base64 --decode | jq -r .api.root.password)
$ export HZN_EXCHANGE_URL=https://$(oc get routes -n kube-system icp-console -o jsonpath='{.spec.host}')/ec-exchange/v1
$ export HZN_EXCHANGE_USER_AUTH="root/root:$EXCHANGE_ROOT_PASS"
$ export HZN_ORG_ID=IBM
```

4. Run the following command to trust the OpenShift Container Platform 4.3 Certificate Authority

```
$  oc --namespace kube-system get secret cluster-ca-cert -o jsonpath="{.data['tls\.crt']}" | base64 --decode > /tmp/icp-ca.crt
```

* Accept the certificate in Ubuntu 

```
$ sudo cp /tmp/icp-ca.crt /usr/local/share/ca-certificates && sudo update-ca-certificates
```

5. Run the following command to create a signing key pair.

```
$ hzn key create <company-name> <owner@email>
```
6. Run the following command to confirm that the setup can communicate with the IBM Edge Computing Manager for Devices exchange API

```
$ hzn exchange status
```

if succesfull you will get 

```
Saifs-MBP:cp4mcm-offline-deployment saifurrehman$ hzn exchange status
{
  "dbSchemaVersion": 31,
  "msg": "Exchange server operating normally",
  "numberOfAgbotAgreements": 3,
  "numberOfAgbotMsgs": 0,
  "numberOfAgbots": 1,
  "numberOfNodeAgreements": 1,
  "numberOfNodeMsgs": 0,
  "numberOfNodes": 2,
  "numberOfUsers": 2
}
```

### Installing Agent on edge devices and registering a node 

#### Collecting required information 

1. ssh to node where you have ```ibm-ecm-4.0.0-x86_64```
2. Go to directory where you have ```ibm-ecm-4.0.0-x86_64``` directory 
3. Populate the following env variables

```
$ export CLUSTER_URL=<cluster-url>
$ export USER=<your-icp-admin-user>
$ export PW=<your-icp-admin-password>
``` 
4. Download the latest version of edgeDeviceFiles.sh:
```
$ curl -O https://raw.githubusercontent.com/open-horizon/examples/v4.0/tools/edgeDeviceFiles.sh
$ chmod +x edgeDeviceFiles.sh
```
5. Run the edgeDeviceFiles.sh script to gather the necessary files:

```
$  ./edgeDeviceFiles.sh <edge-device-type> -t
```

* Supported values: 32-bit-ARM , 64-bit-ARM, x86_64-Linux, or macOS
* -t: create an agentInstallFiles-<edge-device-type>.tar.gz file containing all gathered files. If this flag is not set, the gathered files are placed in the current directory.
* -k: create a new API key named $USER-Edge-Device-API-Key. If this flag is not set, the existing api keys are checked for one named $USER-Edge-Device-API-Key and creation is skipped if the key already exists.
* -d : when installing on 64-bit-ARM or x86_64-Linux, you can specify -d xenial for the older version of Ubuntu, instead of the default bionic. When installing on 32-bit-ARM you can specify -d stretch instead of the default buster. The -d flag is ignored with macOS.
* -f : specify a directory to move gathered files to. If the directory does not exist, it will be created. Default is current directory

This command will generate for you ```agentInstallFiles-<edge-device-type>.tar.gz.```. Copy this file to your edge device 

6. Now that you are logged in via cloudctl, if you need to create additional API keys for users to use with the Horizon hzn command

```
$ cloudctl iam api-key-create "<choose-an-api-key-name>" -d "<choose-an-api-key-description>"
```
> please save the key somewhere 

#### Installing the agent and registering the node 

1. ssh to your edge device
2. make sure horizon is working

```
$ systemctl status horizon
```

3. Unzip the file you copied to edge device from prev steps
4. Navigate to that directory and run
```
$ vi agent-install.cfg
```
Add https:// if it is not present 

5. Populate env variables 

```
$ eval export $(cat agent-install.cfg)
```
6. Open ```/etc/default/horizon``` file

```
$ vi /etc/default/horizon
```

7. Add https:// to all urls. Exit and save

8. Restart horizon

```
$ systemctl retsart horizon
```

9. Have the horizon agent trust agent-install.crt


* Raspberyypy 

```
$ sudo cp horizon-cli.crt /usr/local/share/ca-certificates && sudo update-ca-certificates
```

10. Verify that the agent is running and correctly configured:

```
$ hzn version
Horizon CLI version: 2.24.18
Horizon Agent version: 2.24.18
$ hzn exchange version
2.12.3
$ hzn node list
{
  "id": "Saifs-MBP",
  "organization": null,
  "pattern": null,
  "name": null,
  "token_last_valid_time": "",
  "token_valid": null,
  "ha": null,
  "configstate": {
    "state": "unconfigured",
    "last_update_time": ""
  },
  "configuration": {
    "exchange_api": "icp-console.apps.karun-ocp-43.os.fyre.ibm.com/ec-exchange/v1/",
    "exchange_version": "",
    "required_minimum_exchange_version": "2.11.1",
    "preferred_exchange_version": "2.11.1",
    "mms_api": "icp-console.apps.karun-ocp-43.os.fyre.ibm.com/ec-css",
    "architecture": "amd64",
    "horizon_version": "2.24.18"
  },
  "connectivity": {
    "firmware.bluehorizon.network": true,
    "images.bluehorizon.network": true
  }
}
```

11. Populate auth token key which was generated by ```cloudctl``` command 

```
$ export HZN_EXCHANGE_USER_AUTH=iamapikey:<api-key>
```
12. View the list of sample edge service deployment patterns

```
$ hzn exchange pattern list IBM/
```
