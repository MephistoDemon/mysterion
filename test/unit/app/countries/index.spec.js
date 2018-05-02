import {getCountryName, getCountryNameFromProposal, getCountryCodeFromProposal} from '../../../../src/app/countries'

describe('Countries', () => {
  describe('getCountryName()', () => {
    it('returns name for existing country', () => {
      expect(getCountryName('LT')).to.be.eql('Lithuania')
      expect(getCountryName('US')).to.be.eql('United States')
    })

    it('returns not-found name for unknown country', () => {
      expect(getCountryName('XX')).to.be.eql('N/A')
    })
  })

  describe('getCountryNameFromProposal()', () => {
    it('returns country name from location', () => {
      const proposal = {
        serviceDefinition: {
          locationOriginate: {
            country: 'LT'
          }
        }
      }
      expect(getCountryNameFromProposal(proposal)).to.be.eql('Lithuania')
    })

    it('returns not-found name without location', () => {
      const proposal = {}
      expect(getCountryNameFromProposal(proposal)).to.be.eql('N/A')
    })
  })

  describe('getCountryCodeFromProposal()', () => {
    it('returns country code from location', () => {
      const proposal = {
        serviceDefinition: {
          locationOriginate: {
            country: 'LT'
          }
        }
      }
      expect(getCountryCodeFromProposal(proposal)).to.be.eql('LT')
    })

    it('returns no country code without location', () => {
      const proposalsWithUnsetCountries = [
        {
          serviceDefinition: {
            locationOriginate: {
              country: ''
            }
          }
        },
        {
          serviceDefinition: {
            locationOriginate: {}
          }
        },
        {
          serviceDefinition: {}
        },
        {}
      ]
      for (let proposal in proposalsWithUnsetCountries) {
        expect(getCountryCodeFromProposal(proposal)).to.be.eql(null)
      }
    })
  })
})
