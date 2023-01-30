document.querySelector("#storage").addEventListener('input', (e) => {
  onInputRange(e.target.value, 'storage')
});
document.querySelector("#transfer").addEventListener('input', (e) => {
  onInputRange(e.target.value, 'transfer')
});

const showRangeSlideValue = (newValue, type) => {
  document.querySelector(".rangeSlide__value-" + type).innerHTML = newValue;
}

const createProviders = () => {
  return (
    [
      {
        providerName: 'backblaze',
        storagePrice: 0.005,
        transferPrice: 0.01,
        minPrice: 7,
        maxPrice: '',
        color: 'red',
      },
      {
        providerName: 'bunny',
        storagePrice: (document.querySelector('#ssd').checked) ? 0.02 : 0.01,
        transferPrice: 0.01,
        minPrice: '',
        maxPrice: 10,
        color: 'orange',
      },
      {
        providerName: 'scaleway',
        storagePrice: (document.querySelector('#single').checked) ? 0.03 : 0.06,
        transferPrice: 0.02,
        minPrice: '',
        maxPrice: '',
        color: 'purple',
      },
      {
        providerName: 'vultr',
        storagePrice: 0.01,
        transferPrice: 0.01,
        minPrice: 5,
        maxPrice: '',
        color: 'blue',
      },
    ]
  )
}

const calculatePrice = (provider) => {
  let storage = Number(document.querySelector("#storage").value);
  let transfer = Number(document.querySelector("#transfer").value);

  if (provider.providerName === 'scaleway') {
    storage = (storage <= 75) ? 0 : (storage - 75)
    transfer = (transfer <= 75) ? 0 : (transfer - 75)
  }

  const price = (provider.storagePrice * storage) + (provider.transferPrice * transfer)
  let totalPrice = provider.minPrice ? Math.max(provider.minPrice, price) : provider.maxPrice ? Math.min(provider.maxPrice, price) : price;

  return (storage === 0 && transfer === 0) ? 0 : Math.round(totalPrice * 100) / 100
}

function displayResults() {
  const providers = createProviders();
  let maxTotalPrice;
  let minTotalPrice;

  const prices = providers.map((provider) => {
    return calculatePrice(provider)
  })
  maxTotalPrice = Math.max(...prices)
  minTotalPrice = Math.min(...prices)

  providers.map((provider) => {
    const providerProgress = document.querySelector('.' + provider.providerName + '__value')
    const providerLabel = document.querySelector('.' + provider.providerName + '__value-label')
    const providerPrice = calculatePrice(provider)
    providerProgress.value = providerPrice / 100
    providerLabel.innerHTML = providerPrice + '$'
    providerProgress.style.width = maxTotalPrice !== 0 ? ((providerPrice * 100 / maxTotalPrice) + "%") : 0;
    providerProgress.style.height = maxTotalPrice !== 0 ? ((providerPrice * 100 / maxTotalPrice) + "%") : 0;
    providerProgress.style.background = (providerPrice === minTotalPrice) ? provider.color : 'gray';
  })
}

const onInputRange = (newValue, type) => {
  showRangeSlideValue(newValue, type)
  displayResults()
}

displayResults()

