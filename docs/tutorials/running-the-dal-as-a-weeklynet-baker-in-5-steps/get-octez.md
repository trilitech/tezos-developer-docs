## Step 1: get a Weeklynet-compatible Octez

The Weeklynet test network is restarted once every Wednesday and for most of its lifetime (from level 512) it runs a development version of the Tezos protocol, called Alpha, which is not part of any released version of Octez. For this reason, baking on Weeklynet requires to run Octez either with Docker using a specific Docker image, or by building it from source using a specific git commit.

To get this specific Docker image, or the hash of this specific commit, see https://teztnets.xyz/weeklynet-about. This page also contains the proper `octez-node config init` incantation to configure the Octez node with the current network parameters of Weeklynet, the URL of a public RPC endpoint, and a link to a faucet distributing free teznet tez.

