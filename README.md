# Quick Azure VM creation

sometimes we need a quick linux vm running in our vnets to test something.

This rep is in an early state, but I want it to have a node or python job
boilerplate that gets secrets from az vault.

Right now you can create and destroy a VM in a public space

To create a VM with a new resource group

copy `scripts/config.example` to `scripts/config` and fill it out

```
cd scripts
./setup_vm.sh create
```

Destroy the vm and resource group
```
cd scripts
./setup_vm.sh destroy
```