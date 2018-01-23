<template>
  <div class="page">
    <div class="page__control control">
      <div class="control__top" />
      <div class="control__placeholder" />
      <div class="control__bottom">
        <div class="control__tutorial tutorial">
          <div class="tutorial__container">
            <h2>4 Decentralised</h2>
            <div class="tutorial__text">4 Infinitely Scalable, built using P2P architecture.
              <br/> Without single point of failure – no central
              company or server.</div>
          </div>
        </div>
      </div>
      <div class="control__footer">
        <tutorial-steps class="footer__staps" next="/"></tutorial-steps>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialSteps from '@/components/TutorialSteps'

export default {
  name: 'TutorialDecentralized4',
  components: {
    TutorialSteps
  }
}
</script>
