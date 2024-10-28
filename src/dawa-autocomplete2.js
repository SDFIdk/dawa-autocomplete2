import {autocompleteUi} from './autocomplete-ui.js';
import {AutocompleteController} from './autocomplete-controller.js';
import debounce from 'lodash.debounce';
export function dawaAutocomplete(inputElm, options) {
  options = Object.assign({select: () => null}, options);
  const controllerOptions = ['baseUrl', 'minLength', 'params', 'fuzzy', 'stormodtagerpostnumre', 'supplerendebynavn', 'type'].reduce((memo, optionName)=> {
    if(options.hasOwnProperty(optionName)) {
      memo[optionName] = options[optionName];
    }
    return memo;
  }, {});
  if(!controllerOptions.type) {
    if(options.adgangsadresserOnly) {
      controllerOptions.type = 'adgangsadresse';
    }
    else {
      controllerOptions.type = 'adresse';
    }
  }
  const controller = new AutocompleteController(controllerOptions);
  let updateControllerOnTextChange = (newText, newCaretpos) => controller.update(newText, newCaretpos);
  updateControllerOnTextChange = options.debounce ?
      debounce(updateControllerOnTextChange, options.debounce, {maxWait: 500}) :
      updateControllerOnTextChange;
  const ui = autocompleteUi(inputElm, {
    onSelect: (suggestion) => {
      controller.select(suggestion);
    },
    onTextChange:  updateControllerOnTextChange,
    render: options.render,
    multiline: options.multiline || false
  });
  controller.setRenderCallback(suggestions => ui.setSuggestions(suggestions));
  controller.setSelectCallback(selected => {
    ui.selectAndClose(selected.tekst);
    options.select(selected);
  });
  controller.setInitialRenderCallback(text => ui.selectAndClose(text));
  if(options.id) {
    controller.selectInitial(options.id);
  }

  if (options.onLoadInitial) {
    controller.setInitialLoadCallback(options.onLoadInitial)
  }

  return {
    id: id => controller.selectInitial(id),
    destroy: () => ui.destroy(),
    selected: () => controller.selected
  };
}

