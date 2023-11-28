# DEPRECATED
This repository has been deprecated and migrated to https://github.com/autodesk-platform-services/aps-assets-exchange-excel

# forge-bim360.asset.exchange.excel

[![Node.js](https://img.shields.io/badge/Node.js-12.19-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.14.8-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)

[![BIM-360 API](https://img.shields.io/badge/BIM%20360-api-green.svg)](https://forge.autodesk.com/en/docs/bim360/v1/reference/http/)
[![Asset API](https://img.shields.io/badge/Asset%20API-v1--v2-yellowgreen)](http://developer.autodesk.com/)
[![Relationship API](https://img.shields.io/badge/Relationship%20API-v2-lightgrey)](https://forge.autodesk.com/en/docs/bim360/v1/reference/http/relationship-service-v2-search-relationships-GET/)


[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Intermediate-blue.svg)](http://developer.autodesk.com/)


## Description
This sample demonstrates the following use cases:

* Export assets, categories definitions,custom attributes definitions and status definitions to excel file. The custom attributes values will be also extracted. In addition, the linked resources (issue, checklist, attachment) of asset are extracted by **Relationship API**. They will be listed in as collection. In web view, each resource is enclosed with hyperlink for end user to navigate directly.
* Create new assets, or modify old assets from the list of excel
* Delete assets from the list of excel

The web app provides two options to display the ID properties either in **Raw data** and **Human readable form**.

This sample is implemented based on Node.js version of [Learn Forge Tutorial](https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/tree/nodejs), please refer to https://learnforge.autodesk.io/ for the details about the framework.

## Thumbnail
![thumbnail](/help/main.png)  


## Demonstration
[![https://youtu.be/X2FCxfJi2g8](http://img.youtube.com/vi/X2FCxfJi2g8/0.jpg)](https://youtu.be/X2FCxfJi2g8 "Export / Import BIM360 Asset Sample")

## Live Demo
https://bim360-asset-exchange-excel.herokuapp.com/

Watch [this video](https://youtu.be/X2FCxfJi2g8) on how to play the demo. 


# Web App Setup

## Prerequisites

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
2. **BIM 360 Account**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 
3. **BIM 360 Asset Management**: Create BIM 360 project, activate Asset Management module, setup project to create **Category Definitions**,**Status Set Definitions** and **Custom Attributes Definitions** according to [the guide](https://www.autodesk.com/bim-360/construction-management-software/quality-control-in-construction/asset-equipment-tracking/)
4. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
5. **JavaScript** basic knowledge with **jQuery**

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL. Finally take note of the **Client ID** and **Client Secret**.


## Running locally

Install [NodeJS](https://nodejs.org), version 8 or newer.

Clone this project or download it (this `nodejs` branch only). It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/autodesk-forge/forge-bim360.asset.exchange.excel

Install the required packages using `npm install`.


**Environment variables**

Set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    export FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

Windows (use **Node.js command line** from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    set FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

OR, set enviroment variables of [launch.json](/.vscode/launch.json) for debugging.

Define the socket endpoint same to your host at [this line](/public/js/socket_modules.js#L11), e.g.
```
socketio = io('http://localhost:3000');
```

## Use Cases

1. Open the browser: [http://localhost:3000](http://localhost:3000). 

Please watch the [Video](https://youtu.be/X2FCxfJi2g8) for the detail setup and usage, or follow the steps.

2. After user logging, select a project. The code will start extracting the first page of assets records (about 50 records), and display them in web view. Switch **Raw data** and **Human readable** to check __IDs__ data.
3. Click **Export** option and excute to export all assets, categories, status, custom attributes definitions to excel. 
4. Click **Import** option and execute. Select one excel that contains assets data. Please ensure these columns are available: 
    - clientAssetId
    - category id
    - status id
    
The recommendation is to reuse the skeleton in step #1. To create new assets leave the column __id__ empty. After importing, the new assets will be created, the old assets will be updated with new values. A notification will appears in top-right corner of client side. It indicates how may assets are imported succesfully. Go to BIM 360 UI to vefify.

5.  Click **Delete** option and execute. Select one excel that contains assets data (at least ids). The recommendation is to reuse the skeleton in step #1. After deleting, go to BIM 360 UI to vefify.  A notification will appears in top-right corner of client side. It indicates how may assets are deleted succesfully. 

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/autodesk-forge/forge-bim360.asset.exchange.excel)


## Limitation
1. In excel, because one cell does not support multiple hyperlinks, the exported linked resources (issue/checklist/attachment) are only string with resources names. 


## Tips & Tricks

1. To import or delete assets, the suggested way is to export an excel file first, update the properties within the file, then import it back to BIM 360 Asset.
2. The import (create or patch) and delete are using Batch-xxx endpoints of version 2. This is highly recommended way if you want to batch import/delete. Please DO NOT use single post/patch/delete for large number of assets because it will hit rate limit. The other benifit of using Batch-xxx endpoints is the performance is very good.
3. From version 2, some previously standard attributes of assets (such as warranty date, vendor etc. ) are now moved to custom attributes. However, these definitions are not created by default, so please ensure the definitions have been created.
4. From version 2, the select or multi-select types of custom attributes will return options values as guid. It also require guid if updating the values. So the code maps the option display name and ids. 

## Troubleshooting
1. **Cannot see my BIM 360 projects**: Make sure to provision the Forge App Client ID within the BIM 360 Account, [learn more here](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). This requires the Account Admin permission.
 
## Further Reading
**Document**

 
**Tutorials**:
- [View BIM 360 Models](http://learnforge.autodesk.io/#/tutorials/viewhubmodels)

**Blogs**:
- [Forge Blog](https://forge.autodesk.com/categories/bim-360-api)
- [Field of View](https://fieldofviewblog.wordpress.com/), a BIM focused blog

## License
This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by
Xiaodong Liang [@coldwood](https://twitter.com/coldwood), [Forge Advocate and Support](http://forge.autodesk.com)
