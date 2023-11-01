---
title: Installing the Octez client
lastUpdated: 27th October 2023
---

You can install the Octez client directly on your computer or use a Docker image that has the most recent version of the Octez tools installed.

## Installing the Octez client locally

You can install the Octez client on your computer by using your package manager:

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

You can verify that the Octez client is installed by running this command:

```bash
octez-client --version
```

If you see a message with the version of Octez that you have installed, the Octez client is installed correctly.
For help on Octez, run `octez-client --help` or see the [Octez documentation](http://tezos.gitlab.io/index.html).

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

For a full list of Octez client commands, run `octez-client man`.

## Configuring the Octez client

After you install the Octez client, you can set the RPC node to use.

For example, to use a testnet, follow these steps:

1. On https://teztnets.xyz/, click the testnet to use, such as Ghostnet.

1. Copy the one of the testnet's public RPC endpoints, such as `https://rpc.ghostnet.teztnets.xyz`.

1. Set your Octez client to use this testnet by running this command on the command line, replacing the testnet RPC URL with the URL that you copied:

   ```bash
   octez-client --endpoint https://rpc.ghostnet.teztnets.xyz config update
   ```

   Octez shows a warning that you are using a testnet instead of mainnet.
   You can hide this message by setting the `TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER` environment variable to "YES".

1. Verify that you are using a testnet by running this command:

   ```bash
   octez-client config show
   ```

   The response from Octez includes the URL of the testnet.

The Octez client keeps its configuration data in the `$HOME/.tezos-client/config` file.
