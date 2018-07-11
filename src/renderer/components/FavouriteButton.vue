<!--
  - Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License
  - along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <div
      style="float: right; width: 15%; font-size: 29px; cursor: pointer; color: #99cc33"
      v-bind="country"
      @click="toggleFavorite(country)"
      v-text="buttonText"/>
    <div style="clear:both"/>
  </div>
</template>

<script>
import {toggleFavorite} from '../../app/countries'

export default {
  name: 'FavouriteButton',
  props: {
    country: {
      type: Object,
      required: true
    }
  },

  computed: {
    buttonText () {
      // eslint-disable-next-line
      return this.country && this.country.isFavorite ? '★' : '☆'
    }
  },
  methods: {
    toggleFavorite (country) {
      // eslint-disable-next-line
      console.log('press', country)
      toggleFavorite(country.id)
      this.buttonText = this.country.isFavorite ? '★' : '☆'
    }
  },
  mounted () {
    // eslint-disable-next-line
    console.log('favorit mount')
  }
}
</script>
