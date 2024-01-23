---
title: Unity SDK DAppMetadata object
sidebar_label: DAppMetadata object
authors: Tim McMackin
last_update:
  date: 6 December 2023
---

The Unity SDK class `TezosSDK.Tezos.DAppMetadata`, which is available at runtime as the `TezosManager.Instance.Tezos.DAppMetadata` object, provides read-only properties that provide access to the values that you set on the `TezosManager` prefab in the Unity Editor.

## Properties

These properties are read-only:

- `Name`: The name of the project, which is shown in wallet applications when users connect to the project
- `Url`: The home page of the project
- `Icon`: The URL to a favicon for the project
- `Description`: A description of the project

## Methods

None.
