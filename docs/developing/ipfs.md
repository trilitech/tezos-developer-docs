---
title: Storing data and files with IPFS
authors: 'Tim McMackin'
last_update:
  date: 17 January 2025
---

Because storage space on blockchains is expensive, developers don't put large files or large pieces of static data on Tezos.
Instead, they configure off-chain storage for the files or data and put a link to that data on Tezos itself.
There are different ways to store data in this way, but many blockchain developers use the InterPlanetary File System (IPFS) protocol because it is decentralized.

Some examples of files or data that developers often store on IPFS are:

- Smart contract metadata
- Token metadata
- Token media, such as thumbnails and preview images

One way to upload (or _pin_) data to IPFS is to use Pinata's IPFS provider.
Follow these steps to set up a Pinata account and use it to pin data to IPFS:

1. Create a free Pinata account at https://app.pinata.cloud/developers/api-keys.

1. Go to the API Keys tab and click **New Key**.

1. On the Create New API Key page, expand **API Endpoint Access > Pinning** and enable the `pinFileToIPFS` and `pinJSONToIPFS` permissions, as in this picture:

   ![Selecting the permissions for the Pinata key](/img/developing/pinata-key-permissions.png)

1. In the **Key Name** field, give the key a name, such as "My Key."

1. Click **Create Key**.

   The API Key Info window shows the API key and secret, which you must copy immediately, because they are not shown again.

1. Copy the API Key and API Secret fields and save the values.

   You can see the new API key on the API Keys tab:

   ![The new Pinata API key in the Pinata web app](/img/developing/created-pinata-key.png)

Now you can upload data to IPFS via Pinata in many different ways, including:

- Directly on the Pinata web site
- The SmartPy `sp.pin_on_ipfs` function; see [Uploading metadata](https://smartpy.io/manual/scenarios/metadata#uploading-metadata) in the SmartPy documentation
- The Pinata API and SDK; see https://docs.pinata.cloud

:::warning

Keep your Pinata API Secret private; do not expose it in a frontend web application.
If you want to pin data to IPFS in a web application, you may need to work with Pinata in a backend application to keep your Pinata information secret.

:::
