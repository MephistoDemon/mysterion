import {getCountryName, getCountryNameFromProposal, getCountryCodeFromProposal} from '../../../../src/app/countries'

describe('Countries', () => {
  describe('getCountryName()', () => {
    it('existing country', () => {
      expect(getCountryName('LT')).to.be.eql('Lithuania')
      expect(getCountryName('US')).to.be.eql('United States')
    })

    it('unknown country', () => {
      expect(getCountryName('XX')).to.be.eql('N/A')
    })
  })

  describe('getCountryNameFromProposal()', () => {
    it('found country code', () => {
      const proposal = {
        serviceDefinition: {
          locationOriginate: {
            country: 'LT'
          }
        }
      }
      expect(getCountryNameFromProposal(proposal)).to.be.eql('Lithuania')
    })

    it('not-found country code', () => {
      const proposal = {}
      expect(getCountryNameFromProposal(proposal)).to.be.eql('N/A')
    })
  })

  describe('getCountryCodeFromProposal()', () => {
    it('set country', () => {
      const proposal = {
        serviceDefinition: {
          locationOriginate: {
            country: 'LT'
          }
        }
      }
      expect(getCountryCodeFromProposal(proposal)).to.be.eql('LT')
    })

    it('unset country', () => {
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
