---
id: upgrade
title: Node upgrade
authors: Nomadic Labs
---

In this chapter, we will see the CLI command lines to install the necessary dependencies to upgrade a Tezos node.


## Upgrade an Octez node

As you may know, Tezos is an evolving blockchain. Through its on-chain governance mechanism, Tezos smoothly evolves to become more secure and scalable
over time.

The following commands help to upgrade your node to the latest Octez version.

:::caution
That version `14.0` changes the storage format. A `octez-node upgrade storage` is mandatory to update your storage. This upgrade is instantaneous but the data-directory used by your node can no longer be used with version `13.0` once upgraded (if you are using docker, see [upgrade instructions](#upgrade-storage) in `Bonus: Quick synchronization from a snapshot`).
:::

### Docker and docker-compose

<details>
<summary>Upgrade the docker image</summary>
To upgrade your node to the lastest Octez version, replace your previous image version (probably v13.0) by the lastest: v<:CURRENT_OCTEZ_VERSION:>.
Note that if you run the image latest, a restart of your container is sufficient.

To use the `v<:CURRENT_OCTEZ_VERSION:>` image, execute the following command:

```bash
docker run tezos/tezos:v<:CURRENT_OCTEZ_VERSION:> ...
```

</details>

### Serokell PPA with Tezos packages

<details>
<summary>Upgrade tezos packages</summary>

To fetch the latest node version, run the following command:

```bash
sudo apt-get update
sudo apt-get upgrade
```

</details>

### From source

#### From scratch

<details>
<summary>Upgrade from scratch</summary>

Execute the following commands in your tezos repository:

```bash
git fetch
git checkout v<:CURRENT_OCTEZ_VERSION:>
opam switch remove .
rm -rf _opam _build
make build-deps
eval $(opam env)
make
```

:::caution
A `opam switch remove .` is only needed if you are updating an already compiled repository, not if you are compiling from a freshly cloned repository.
:::
</details>

#### Tezos opam packages

<details>
<summary>Upgrade using opam</summary>

Run the following commands:

```bash
opam update
opam depext
opam upgrade
```
</details>

:::caution
Be careful when closing terminal windows because this stops the node.
:::

:::tip
Use [screen](https://doc.ubuntu-fr.org/screen), or [nohup](https://www.computerhope.com/unix/unohup.htm) to keep the node running in the background.
:::