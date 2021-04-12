#!/usr/bin/env bash
set -e
# for watching the command uncomment below
# set -x 
SCRIPT_DIR=`dirname "$0":`

. "${SCRIPT_DIR}/lib"

cli_help() {
  cli_name=${0##*/}
  echo "
$cli_name

Commands:
  account a :=> list subscriptions
	deploy  d :=> Deploy a new vm
  list-sizes l :=> List the size vms available
  *         Help
"
  exit 1
}

# cli_log "Exporting config ..."
source "${SCRIPT_DIR}/config"
VM_NAME="vm_${APP_NAME}"
RESOURCE_GROUP="rg_${APP_NAME}_tmp_job_vm"

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
  list-sizes|l)
    list_sizes
    ;;
  get-subnet-id)
    get_subnet_id
    echo $SUBNET_ID
    ;;
  ssh|s)
    ssh_to_last_created
    ;;
  scp)
    scp_job_dir
    ;;
  *)
    cli_help
    ;;
esac


# az extension add -n application-insights

# az monitor app-insights component create \
#   --app aaronVMTest \
#   --location eastus \
#   --resource-group rg-aaron-vm-eastus 

#   az monitor app-insights component show \
#   --app aaronVMTest \
#   --resource-group rg-aaron-vm-eastus \
#   | jq '[.connectionString, .instrumentationKey]'

# az monitor app-insights events show \
#     --resource-group rg-aaron-vm-eastus \
#     --app aaronVMTest --type traces
