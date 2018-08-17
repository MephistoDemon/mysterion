<!--
  - Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
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

  <div class="appError">
    <h4>{{ error.message }}</h4>
    <div>{{ error.hint }}</div>
    <a
      class="report-issue"
      @click="reportIssue()">report issue</a>
  </div>

</template>

<style lang="scss">
  .appError {
    font-size: medium;
    line-height: 1.43;
    text-align: center;
    h4 {
      color: red;
      font-weight: 600;
      font-size: x-large;
    }
    .report-issue {
      font-weight: 500;
      font-size: large;
      text-decoration: underline;
      cursor: pointer;
    }
  }
</style>

<script>
export default {
  name: 'AppError',
  dependencies: ['feedbackForm'],
  data () {
    return {}
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  methods: {
    reportIssue () {
      this.feedbackForm.show()
    }
  }
}
</script>
