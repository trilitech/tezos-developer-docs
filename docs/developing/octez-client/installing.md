---
title: Installing the Octez client
last_update:
  date: 27 October 2023
dependencies:
  octez: 21.1
---

You can install the Octez client directly on your computer or use a Docker image that has the most recent version of the Octez tools installed.

## Installing the Octez client locally

You can install the Octez client on your computer by using your package manager.
Then, initialize it to use the RPC node of your choice:

1. Install the client:

   - For MacOS, run these commands:

      ```bash
      brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
      brew install tezos-client
      ```

   - For Ubuntu, Windows WSL, and Linux distributions that use `apt`, run these commands:

      ```bash
      REPO="ppa:serokell/tezos"
      sudo add-apt-repository -y $REPO && sudo apt-get update
      sudo apt-get install -y tezos-client
      ```

   - For Fedora and Linux distributions that use Copr, run these commands:

      ```bash
      REPO="@Serokell/Tezos"
      dnf copr enable -y $REPO && dnf update -y
      dnf install -y tezos-client
      ```

   For more local installation options, see [How to get Tezos](https://tezos.gitlab.io/introduction/howtoget.html) in the Octez documentation.

1. Verify that the Octez client is installed by running this command:

   ```bash
   octez-client --version
   ```

   If you see a message with the version of Octez that you have installed, the Octez client is installed correctly.
   For help on Octez, run `octez-client --help` or see the [Octez documentation](http://tezos.gitlab.io/index.html).

1. Initialize the client's configuration file by running this command:

   ```bash
   octez-client config init
   ```

   This command creates a default configuration file in the location `$HOME/.tezos-client/config`.

1. Set the RPC node to use:

   1. Get the URL of a public RPC node or a private node that you have access to.
   For example, you can get the URL of a testnet node from https://teztnets.com/, such as `https://rpc.ghostnet.teztnets.com` for Ghostnet.

   1. Set your Octez client to use this node by running this command on the command line, replacing the Ghostnet URL with the URL that you copied:

      ```bash
      octez-client --endpoint https://rpc.ghostnet.teztnets.com config update
      ```

      If you are using a testnet, Octez shows a warning that you are not using Mainnet.
      You can hide this message by setting the `TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER` environment variable to "YES".

   1. Verify that you are using the correct RPC URL by running this command:

      ```bash
      octez-client config show
      ```

      The response from Octez includes the URL of the RPC node that you are using.

For a full list of Octez client commands, run `octez-client man`.

## Using the Octez client in the Tezos Docker image

The Tezos Docker image contains the latest version of the Octez client and the other Octez tools.
To start a container from this image, run this command:

```bash
docker run -it --rm --entrypoint /bin/sh --name octez-container tezos/tezos:latest
```

You can verify that the Octez client is available in the container by running this command:

```bash
octez-client --version
```

Then set the RPC node for the client as described above.

For more information about using the Docker image, see [Using Docker Images And Docker-Compose](https://tezos.gitlab.io/introduction/howtoget.html#using-docker-images-and-docker-compose) in the Octez documentation.
