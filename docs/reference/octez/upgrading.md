---
title: Upgrading nodes
authors: Nomadic Labs
lastUpdated: 29th June 2023
---

Here we cover the CLI commands to install the necessary dependencies to upgrade an Octez node.

## Upgrade an Octez node

As you may know, Tezos is an evolving blockchain. Through its on-chain governance mechanism, Tezos smoothly evolves to become more secure and scalable
over time.

The following commands help to upgrade your node to the latest Octez version.

### Docker and docker-compose

#### Upgrade the docker image

To upgrade your node to the latest Octez version, run the lastest image. Note that if you run the latest image, restarting your container is sufficient.

See the [list of releases](https://tezos.gitlab.io/releases/releases.html) for the latest version number, and replace v17 below with that.

To upgrade to version 17 for instance, run:

```bash
docker run tezos/tezos:v17 ...
```

### Serokell PPA with Tezos packages

#### Upgrade tezos packages

To fetch the latest node version, run the following command:

```bash
sudo apt-get update
sudo apt-get upgrade
```

### From source

#### Upgrade from scratch

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

:::warning Opam switch remove
`opam switch remove .` is only needed if you are updating an already compiled repository, not if you are compiling from a freshly cloned repository.

#### Upgrade using opam packages

Run the following commands:

```bash
opam update
opam depext
opam upgrade
```

:::warning Closing terminal
Be careful when closing terminal windows because this stops the node.

:::note Using screen
Use [screen](https://doc.ubuntu-fr.org/screen), or [nohup](https://www.computerhope.com/unix/unohup.htm) to keep the node running in the background.
