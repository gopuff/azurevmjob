#!/usr/bin/env bash
set -e

. "./lib"

cli_help() {
  cli_name=${0##*/}
  echo "
$cli_name

Commands:
  account a :=> list subscriptions
	deploy  d :=> Deploy a new vm
  *         Help
"
  exit 1
}

# cli_log "Exporting config ..."
source ./config
VM_NAME="vm_${APP_NAME}"
RESOURCE_GROUP="rg_${APP_NAME}"

case "$1" in
  accounts|a)
    get_account_list
    ;;
  create|c)
    create
    ;;
  destroy|d)
    destroy
    ;;
  test|t)
    test
    ;;
  *)
    cli_help
    ;;
esac



# subscription_list:
# 	echo "You have access to the following subscriptions\n"
# 	az account list --all --query '[].name' --output tsv

# subscription_set:
# 	az account set --subscription "${SUBSCRIPTION}"
# 	echo "Subscription set to `az account show  --query 'name' --output tsv`"

# RG_EXISTS=$(shell az group exists --name ${RESOURCE_GROUP})
# resource_group_create:
# 	echo ${RESOURCE_GROUP}
	
# 	echo ${RG_EXISTS}
# 	ifeq (${RG_EXISTS}, true)
# 		echo "Resource Group ${RESOURCE_GROUP} already exists"
# 	else
# 		az group create --location ${LOCATION} --name ${RESOURCE_GROUP} --query "properties.provisioningState"

# default: 
# 	echo ${JOB_NAME}_${LOCATION}


# az account list --all --query '[?isDefault].join(`  `, [`default: `, name,`[`, id, `]`]) | [0]'

# az group create --location eastus --name rg-aaron-vm-eastus 

# az extension add -n application-insights

# az monitor app-insights component create \
#   --app aaronVMTest \
#   --location eastus \
#   --resource-group rg-aaron-vm-eastus 

#   "InstrumentationKey=7185f132-6332-4a03-805d-5c38e231b919;IngestionEndpoint=https://eastus-3.in.applicationinsights.azure.com/",

#   az monitor app-insights component show \
#   --app aaronVMTest \
#   --resource-group rg-aaron-vm-eastus \
#   | jq '[.connectionString, .instrumentationKey]'


# az vm create \
#   --resource-group rg-aaron-vm-eastus \
#   --name demo-vm \
#   --location eastus \
#   --image UbuntuLTS \
#   --admin-username azureuser \
#   --generate-ssh-keys \
#   --custom-data cloud-init.txt \ 
#   --tags createdBy=$user 

#    "52.255.202.166",


#   ssh 52.255.202.166

# az monitor app-insights events show \
#     --resource-group rg-aaron-vm-eastus \
#     --app aaronVMTest --type traces

#     az group delete --name rg-aaron-vm-eastus -y