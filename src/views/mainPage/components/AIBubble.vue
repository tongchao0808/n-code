<script>
import Markdown from "@/components/custom/md/Markdown.vue";
import AIBubbleThinkingStatus from "@/views/mainPage/components/AIBubbleThinkingStatus.vue";
import AIBubbleFooter from "@/views/mainPage/components/AIBubbleFooter.vue";

export default {
  name: "AIBubble",
  components: {AIBubbleFooter, AIBubbleThinkingStatus, Markdown},
  props: {
    message: {type: Object, required: true},
    messageId: {type: String, required: false},
    thinking: {type: Boolean, required: true},
    doDeleteMessage: {type: Function, required: true},
    doReAnswer: {type: Function, required: true},
    doSuggestion: {type: Function, required: true},
    doViewReferences: {type: Function, required: true},
    doAddMessageToKg: {type: Function, required: true},
    isLastMessage: {type: Boolean, default: false},
    simpleMode: {type: Boolean, default: false},
  }
}
</script>

<template>
  <div class="w-full">
    <AIBubbleThinkingStatus :thinking="thinking"/>
    <template>
      <Markdown :content="message.content" :selected-bubble="true" />
    </template>
    <AIBubbleFooter :show="!thinking" :message="message" :message-id="messageId"
                    :do-add-message-to-kg="doAddMessageToKg"
                    :do-delete-message="doDeleteMessage"
                    :do-re-answer="doReAnswer"
                    :simple-mode="simpleMode"
                    :do-suggestion="doSuggestion"
                    :is-last-message="isLastMessage"
                    :do-view-references="(x) => doViewReferences(x)"/>
  </div>
</template>

<style scoped lang="scss">

</style>
