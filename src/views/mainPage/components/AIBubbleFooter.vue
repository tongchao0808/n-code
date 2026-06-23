<script>
import BubbleSuggestions from "@/views/mainPage/components/BubbleSuggestions.vue";
import BubbleOperationButtons from "@/views/mainPage/components/BubbleOperationButtons.vue";
import BubbleReferences from "@/views/mainPage/components/BubbleReferences.vue";

export default {
  name: "AIBubbleFooter",
  components: {BubbleReferences, BubbleOperationButtons, BubbleSuggestions},
  props: {
    show: {type: Boolean, default: true},
    message: {type: Object, default: ""},
    messageId: {type: String, required: false},
    doDeleteMessage: {type: Function, required: false},
    doReAnswer: {type: Function, required: false},
    doSuggestion: {type: Function, required: false},
    doViewReferences: {type: Function, required: false},
    doAddMessageToKg: {type: Function, required: true},
    isLastMessage: {type: Boolean, default: false},
    simpleMode: {type: Boolean, default: false},
  },
  methods: {
    doCopyMessageContent() {
      this.$copyText(this.message.content)
        .then((e) => {
          this.$modal.msgSuccess("复制成功");
        });
    },
  },
  computed: {
    references() {
      return this.message.references || [];
    },
    suggestions() {
      return this.message.suggestions || [];
    },
  }
}
</script>

<template>
  <div v-if="show" class="w-full flex flex-col gap-3 pt-[8px]">
    <BubbleReferences :message-id="messageId" :references="references" :message="message"
                      :do-view-references="(id) => doViewReferences(id)"/>
    <BubbleOperationButtons :message-id="messageId"
                            :simple-mode="simpleMode"
                            :do-copy="doCopyMessageContent"
                            :do-re-answer="doReAnswer"
                            :do-delete-message="doDeleteMessage"
                            :do-add-message-to-kg="doAddMessageToKg"
                            :knowledge-database-relations="message.knowledgeDatabaseRelations"
                            />
    <BubbleSuggestions v-if="isLastMessage" :suggestions="suggestions"
                       :do-suggestion="doSuggestion"/>
  </div>
</template>

<style scoped lang="scss">

</style>
