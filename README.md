# Quick Azure VM creation

Sometimes we need a quick linux vm running in our vnets to test something.

This repo is in an early state, currently this will
1. Create a new resource group using app name
2. Create a new linux vm with node14 in an existing vnet (using a private ip, so VPN is required, and you can access cosmosDB)
3. `scp` the job folder to the new vm
4. `ssh` into the new vm
5. DESTORY the vm and resouce group when you are done. (which takes longer then create)

![Demo](demo.gif)

## Installation
- you must have the `az cli` [installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) with suffiencient permissions to create resources
- copy `scripts/config.example` to `scripts/config` and fill it out
- The `az vm create` command will either use your existing public keys in `~/.ssh` or generate a new keypair.  

*Note*: When you ssh this server will be added to your 'known hosts' file with a fingerprint.  If you generate another server and get the same IP, ssh will throw an error.  You need to delete the old entry from `.ssh/known_hosts`

```
# create a new VM
$ ./script/setup_vm.sh create

# Note: you will be logged in right away, but the cloud-init takes a few minutes to get node installed.

# Destroy the vm and resource group
$ ./script/setup_vm.sh destroy

# ssh into the new vm
$ ./script/setup_vm.sh ssh

# copy the local jobs folder to the new vm (it will copy automatically after create)
$ ./script/setup_vm.sh scp

```

## Configuration
Make a copy of `script/config.example` and save it as `script/config`

- SUBSCRIPTION="Development"
The name of the subscription to use.  If you are unsure of what you have access to run
```./script/setup_vm.sh accounts```

- APP_NAME=aaron_vm_test
APP_Name is the base name of the resources you will create.  Should not matter much, because this vm won't be around long....

- VM_SIZE=Standard_B2ms
The size of the VM to create.  'B' instances are cheap and good for experiments, but the 'D' ones have more power.  In case you don't have this memorized, you can run
```./script/setup_vm.sh list-sizes```

- VNET_RESOURCE_GROUP=MyMainRG
The resource group that the VNET lives in. Please check with the infrastructure teams to get the right VNET information!

  Referencing 2 different resource groups is a bit confusing.  We will be creating a new resource group for your server, but using a vnet from an existing resource group.  Your resource group destroyed when we are done.  The VNET resource group sticks around.

- VNET_NAME=MyVNET
The name of the vnet to use (the one that lives in the above resource group)

- VNET_SUBNET=MySubnet
The name of the subnet to deploy the vm into (the subnet in VNET_NAME)

- SKIP_RG_CHECK=false
If this is not set to true then the script will fail the second time you try to create a vm that already exists. You may want to run `az vm create` a second time, so if you do - use this option.

## Sample job
The sample job spins up a few workers to batch a bunch of cosmos data to kinesis.  If you want to run it, you to set some environmental variables.  I recommend a .env file and either the `dotenv` package or something like.

```
# Run a serial job
npm i
export $(cat .env | xargs)  && node index.js

#run concurrent batches
npm i
export $(cat .env | xargs)  && node runParallel.js
```

## Todo
[] Setup application insights and inject it into the vm

[] use azvalult and a managed identity to get secrets
