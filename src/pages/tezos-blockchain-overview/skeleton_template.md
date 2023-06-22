---
id: skeleton-template
title: Skeleton Template
slug: /skeleton-template
authors: Author One, Author Two
---

Intro text here. This appears after the doc title (which is the "H1 heading"" for the doc). What follows is a series of "## Sections". Note that only ## and ### sections will appear on the right nav. Headings with #### or ##### are just a way to make a bold heading to distinguash a particular point, they don't appear as if they are heading a new subtopic. 

{% callout type="note" title="Note" %}
Optional callout here at end of the intro text. All callouts should have the "title" attribute completed. 
{% /callout %}

## Prerequisites

Any Prerequisites go right after intro 


{% table %}
* Dependency
* Installation instructions
---
* SmartPy
* Follow the _Installation_ steps in this [guide](https://smartpy.dev/docs/manual/introduction/installation). SmartPy requires Docker to run. For MacOS and Linux, it is recommended to install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
---
* _octez-client_ CLI
* Follow the _How to install the octez-client_ steps [here](/developers/docs/tezos-basics/get-started-with-octez/
{% /table %}
                                                                                                    

{% callout type="warning" title="Important" %}
Optional callout here. A callout can go anywhere. It needs to appear adjacent to the material it's referring to.
{% /callout %}


## First Main Section - Topic 1

The first main section. It's heading has two ##

Some dummy text and code block: Now we can go ahead and create a folder somewhere on our local drive with the name of the project. Let's call it `example-smart-contract`.

```bash
mkdir example-smart-contract
```

### First Subsection of Topic 1

More details about topic 1 are here.

Some dummy text and code block: The preferred way of running SmartPy is via the `smartPy` wrapper. To obtain the SmartPy executable within your local project folder:

Some code block 

```bash
wget smartpy.io/smartpy
chmod a+x smartpy
```

#### Giving a heading to something 

Some material that needs its own heading, but it won't appear in the right nav menu.  


### Second Subsection of Topic 1

Another or alternative details about Topic 1

Some dummy text: The preferred way of running SmartPy is via the `smartPy` wrapper. To obtain the SmartPy executable within your local project folder:

```bash
wget smartpy.io/smartpy
chmod a+x smartpy
```


## Second Main Section - Topic 2

Another top level section 

Some dummy text: Inside the `example-smart-contract` folder, let's create a file called `store_greeting.py` and save it. We'll need this file later.

```bash
touch store_greeting.py
```

### First subsection of Topic 2 

Here are more details about topic 2 here. 

Some dummy text: Add alias using Tezos address (public key hash). Such aliases do not have an associated private key and cannot be used to sign Tezos operations.


## Conclusion - Final Section 

A short conclusion or summary. This sits at the same level as the other top-level sections.

Addition resources can either be with a callout if it's just one or two links. Otherwise it should be in a table. 


{% callout type="note" title="Addtional Resources" %}
On SmartPy's website you can find the [manual](https://smartpy.dev/docs/manual/introduction/overview) and [guides](https://smartpy.dev/docs/guides/) and explore contract examples on SmartPy's [online IDE](https://smartpy.dev/ide). In addition, see the [SmartPy material](https://opentezos.com/smartpy) on OpenTezos. 
{% /callout %}


{% table %}
* Reading
---
* [Decentralized oracles, a comprehensive overview](https://medium.com/fabric-ventures/decentralised-oracles-a-comprehensive-overview-d3168b9a8841)
---
* [Verifiable Oracles for Tezos by ubinetic](https://ubinetic.medium.com/oracles-by-ubinetic-1f358779425)
---
* [DOS Network white paper](https://s3.amazonaws.com/whitepaper.dos/DOS+Network+Technical+Whitepaper.pdf)
{% /table %}