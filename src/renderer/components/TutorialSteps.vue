<template>
    <div class="steps">
        <router-link to="/" class="steps__btn steps__btn--skip btn btn--transparent"
                     tag="button">skip
        </router-link>
        <div class="steps__bullets">
            <router-link to="/tutorial/decentralized" class="steps__bullet"
                         tag="i"></router-link>
            <router-link to="/tutorial/decentralized2" class="steps__bullet"
                         tag="i"></router-link>
            <router-link to="/tutorial/decentralized3" class="steps__bullet"
                         tag="i"></router-link>
            <router-link to="/tutorial/decentralized4" class="steps__bullet"
                         tag="i"></router-link>
        </div>
        <router-link :to="next" class="steps__btn steps__btn--next btn btn--transparent"
                     tag="button">next
        </router-link>
    </div>
</template>

<script>
  export default {
    name: 'TutorialSteps',
    props: ['next']
  }
</script>
