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
Make sure you have Microsoft.JSInterop nuget. In any .razor component add this: 
Underneath is demonstrated how text can be retrived from the autocomplete component,this is then used to make http r request to get other information into memory of the app. 
```razor
 @using Microsoft.JSInterop
@using Newtonsoft.Json

<div  class="autocomplete-container">
    <input  placeholder="Søg efter adresse" title="Søg efter adresse" @bind-value="@adresseString" @bind-value:event="onchange" type="search" id="dawa-autocomplete-input">
</div>
<p>Valgt adresse:  @adresseString</p>
<SfButton @onclick="AccessValgtadresseElement">HTTP REQUEST Get adresse from DAWA</SfButton>


<p>
    Projekt er beliggende på @adresseString, i @kommune kommune, i @regionsnavn. Adressen har er i ejerlav @ejerlavnavn med matrikel nr. @matrikelnr .
    Bebyggelsen er i en @zone og ca. DHM(@højde) . Koordinatorner til adressen er bredde/længde @wgs84koordinat_bredde / @wgs84koordinat_længde
</p>

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

    //value to populate with the Http response, could be whatever, eg. a class.
    string vejnavn;
    string husnr;
    string etage;
    string dør;
    string postnr;
    string postnrnavn;
    string kommune;
    string ejerlavnavn;
    string matrikelnr;
    string regionsnavn;
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
            vejnavn = result[0]["vejnavn"];
            husnr = result[0]["husnr"];
            etage = result[0]["etage"];
            dør = result[0]["dør"];
            postnr = result[0]["postnr"];
            postnrnavn = result[0]["postnrnavn"];
            kommune = result[0]["kommune"];
            ejerlavnavn = result[0]["ejerlavnavn"];
            matrikelnr = result[0]["matrikelnr"];
            regionsnavn = result[0]["regionsnavn"];
            højde = result[0]["højde"];
            wgs84koordinat_bredde = result[0]["wgs84koordinat_bredde"];
            wgs84koordinat_længde = result[0]["wgs84koordinat_længde"];
            zone = result[0]["zone"];

            // Do something with the values, save to db or whatever
            // ...
        }

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

