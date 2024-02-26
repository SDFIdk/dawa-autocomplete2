![Build Status](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidFUyM1pUSGdsVGF1R0cyWlcxeTM1NnlnYmZYVUVCR3BSQXFlUTNVQWJnbGg2VVE1bk5oTnIyL2oxUE5uNWRjMERpTlc0bXZmWkZrSGQxUHhYblptcEhRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjVNQnMyeVFWNDVYUjBOTkUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
# dawa-autocomplete2

DAWA Autocomplete2 is a JavaScript-component which makes it possible to enter a danish address in a single input field. 
The component uses [Danmarks Adressers WEB API](https://dawadocs.dataforsyningen.dk).

## Browser support
The component is tested in IE11, Edge, Chrome, Safari and Firefox.

## Usage
DAWA Autocomplete2 may be installed using NPM, or it may be loaded into the browser using a `<script>`-tag. 
For a working demo page, please see dawadocs.dataforsyningen.dk/demo/autocomplete/demo.html

### Usage via &lt;script&gt; tag
First, include the autocomplete component on the page:
```html
    <script src="https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js"></script>
```
Note that this version of the autocomplete component polyfills some functionality not supported by IE11, which changes the global namespace.
If you provide your own polyfills, or do not care about older browsers, we provide a version without polyfills:
```html
    <script src="https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/unfilled/dawa-autocomplete2.min.js"></script>
```

Some CSS rules must be added to the page in order to render the autocomplete suggestions correctly.
All styling and positioning of the autocomplete suggestions is handled using CSS rules.

The autocomplete suggestions are rendered immediately after the input-field. In order to ensure that
they have the same width, the input field is wrapped in a DIV-element:
```html
<div class="autocomplete-container">
  <input type="search" id="dawa-autocomplete-input">
  <!-- Suggestions will appear here -->
</div>
```

The DIV element is used to ensure that the input field and the suggestions have the same width. Add the following
CSS rules to the page in order to ensure that the suggestions are rendered correctly:

```css
.autocomplete-container {
    /* relative position for at de absolut positionerede forslag får korrekt placering.*/
    position: relative;
    width: 100%;
    max-width: 30em;
}

.autocomplete-container input {
    /* Både input og forslag får samme bredde som omkringliggende DIV */
    width: 100%;
    box-sizing: border-box;
}

.dawa-autocomplete-suggestions {
    margin: 0.3em 0 0 0;
    padding: 0;
    text-align: left;
    border-radius: 0.3125em;
    background: #fcfcfc;
    box-shadow: 0 0.0625em 0.15625em rgba(0,0,0,.15);
    position: absolute;
    left: 0;
    right: 0;
    z-index: 9999;
    overflow-y: auto;
    box-sizing: border-box;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion {
    margin: 0;
    list-style: none;
    cursor: pointer;
    padding: 0.4em 0.6em;
    color: #333;
    border: 0.0625em solid #ddd;
    border-bottom-width: 0;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    border-bottom-width: 0.0625em;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion.dawa-selected,
.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:hover {
    background: #f0f0f0;
}
```

The component is initialized using JavaScript:
```javascript
dawaAutocomplete.dawaAutocomplete(document.getElementById('dawa-autocomplete-input'), {
  select: function(selected) {
    console.log('Valgt adresse: ' + selected.tekst);
  }
});
```

### Usage via NPM
DAWA Autocomplete2 is published in the NPM registry. Note that in order to use NPM modules directly for web pages,
you need to use a tool like [Webpack](https://webpack.github.io/).
```bash
npm install dawa-autocomplete2
```

CSS styling is handled in the same way as above. 
The component is imported and initialized like this:
```javascript
var dawaAutocomplete2 = require('dawa-autocomplete2');
var inputElm = document.getElementById('dawa-autocomplete-input');
var component = dawaAutocomplete2.dawaAutocomplete(inputElm, {
  select: function(selected) {
    console.log('Valgt adresse: ' + selected.tekst);
  }
});
```

### Usage in Blazor .net 8
Vi takker
Daniel Bo Olesen
27289441
arbejde dbo@oceng.dk / privat danielboolesen1@me.com for dette bidrag til at udbrede brugen af Autocomplete.🙏🏻

Not a native implementation with .razor components, the overall method is to use the .js and get the selected address into memory and make a http request with it, and manage the response. This setup is tested in a blank app. The solution could be more refined for production purposes, but provides a basic proff of concept for using the DawaAutoComplete in blazor.
In App.Razor add the following in the Head and body: 
```razor
<Head>
    @* For dawa autocomple address search *@
    <script src="https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js"></script>
    <script src="https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/unfilled/dawa-autocomplete2.min.js"></script>
<Head>
<body>
    @* For dawa autocomple address search *@
    <script>
        function loadDawaAutocomplete() {
            dawaAutocomplete.dawaAutocomplete(document.getElementById('dawa-autocomplete-input'), {
                select: function (selected) {
                    document.getElementById("valgtadresse").innerHTML = selected.tekst;
                }
            });
        }
    </script>
</body>
```
Make sure you have Microsoft.JSInterop and Newtonsoft.json nuget. In any .razor component add this: 
Underneath is demonstrated how text can be retrived from the autocomplete component, this is then used to make http request with r= to get other information into memory. 
```razor
@using Microsoft.JSInterop
@using Newtonsoft.Json

<div class="autocomplete-container">
    <input placeholder="Search for adress" title="Search for adress" @bind-value="@adresseString" @bind-value:event="onchange" type="search" id="dawa-autocomplete-input">
</div>
<p>Choosen adress from javascript in app.razor body: <span id="valgtadresse" /></p>
<p>Chosen adresse from blazor bind-value:  @adresseString</p>
<button @onclick="AccessValgtadresseElement">HTTP REQUEST Get full adresse json from DAWA</button>
<p>USE VALUES FROM JASON: The adress @betegnelse is in a @zone and at DHM(@højde). Coordinates to the adress is latitude/longitude @wgs84koordinat_bredde/@wgs84koordinat_længde </p>

<style>
   /*Add (copy/paste) .css from earlier in this readme here */
</style>

@code {
    [Inject] protected IJSRuntime JSRuntime { get; set; }
    private string adresseString;

    //Initiates the DAWA autocomplete
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JSRuntime.InvokeVoidAsync("loadDawaAutocomplete");
        }
    }

    //values to populate with the Http response, could be whatever, eg. a class.
    string betegnelse;
    string højde;
    string wgs84koordinat_bredde;
    string wgs84koordinat_længde;
    string zone;

    //Make the request to the API
    private async Task<string> GetApiResponse(string apiUrl)
    {
        using (HttpClient client = new HttpClient())
        {
            HttpResponseMessage response = await client.GetAsync(apiUrl);
            if (response.IsSuccessStatusCode)
            {
                string json = await response.Content.ReadAsStringAsync();
                return json;
            }
            else
            {
                // Handle error response
                return null;
            }
        }
    }
    private async Task ProcessApiResponse(string json)
    {
        // Deserialize the JSON response into a dynamic object
        dynamic result = JsonConvert.DeserializeObject<dynamic>(json);

        // Access the desired values from the result object
        betegnelse = result[0]["betegnelse"];
        højde = result[0]["højde"];
        wgs84koordinat_bredde = result[0]["wgs84koordinat_bredde"];
        wgs84koordinat_længde = result[0]["wgs84koordinat_længde"];
        zone = result[0]["zone"];

        // Do something with the values, save to db or whatever
        // ...
    }
    //The selected string from the DAWA autocomplete is used to make the request to the API, the q search is used see dawa documentation, and the struktur=flad is used to simplify response structure.
    private async Task AccessValgtadresseElement()
    {
        var apiUrl = $"https://api.dataforsyningen.dk/adresser/?q={Uri.EscapeDataString(adresseString)}&struktur=flad";
        string json = await GetApiResponse(apiUrl);
        if (json != null)
        {
            await ProcessApiResponse(json);
        }
        else
        {
            // Handle error case
        }
        //On submit the input field is cleared and the component is re-rendered
        adresseString = null;
        await JSRuntime.InvokeVoidAsync("loadDawaAutocomplete");
    }
}
```

### Options
The following options are supported:

 - `select`: This function is called whenever the user selects an address.
 - `baseUrl`: URL to DAWA, defaults to `https://api.dataforsyningen.dk/adreser`.
 - `adgangsadresserOnly`: The user enters an access address, not a complete address with floor/suite. Defaults to `false`.
 - `fuzzy`: Whether fuzzy searching is enabled, defaults to `true`.
 - `params`: A JavaScript object containing any additional parameters to send to DAWA, e.g. `{kommunekode: "101"}`. Any parameter supported by the API can be specified. Please check the [API docs](https://dawadocs.dataforsyningen.dk/dok/api/autocomplete#autocomplete) for further information:
 - `stormodtagerpostnumre`: Whether "stormodtagerpostnumre" will be displayed in suggestions. Defaults to `true`.
 - `minLength`: Number of characters which must be entered before any suggestions is displayed. Defaults to `2`.
 - `multiline`: Display address suggestions on multiple lines. Default `false`.
 - `id`: Initialize the input field with the address specified by the given UUID. If the address does not exist, the input field is left empty.

### API
The component has the following api:
 
 - `destroy()`: Removes the component and any event listeners from the DOM.
 - `selected()`: Returns the selected autocomplete entry, or null if no selection has been made yet.
 - `id(uuid)`: Populate the input field with the address specified by the uuid parameter.

### Cleanup
Calling `destroy` removes the autocomplete component and any event listeners from the DOM:
```javascript
    var autocomplete =  dawaAutocomplete(inputElm, {});
    autocomplete.destroy();
```

## Get help
Contact SDFI support support@sdfi.dk or call +45 78 76 87 92
Open Monday to Thursday 09:00 AM - 02:00 PM, and Friday 10:00 AM - 14:00 PM.
 
## Contributing
Patches are welcome. To start a development server on port 8080, first clone the repository and then run:

 - `npm install`
 - `npm run dev`
 
Now you can open http://localhost:8080/html/demo .
 
## License
Copyright © 2019 Styrelsen for Dataforsyning og Effektivisering (SDFE)

Distributed under the [MIT license](https://opensource.org/licenses/MIT).

