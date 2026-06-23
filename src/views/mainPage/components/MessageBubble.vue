<script>
import FuncButton from "@/views/mainPage/components/FuncButton.vue";
import ResponseSuggestion from "@/views/mainPage/components/ResponseSuggestion.vue";
import Markdown from "@/components/custom/md/Markdown.vue";
import AddToKgButton from "@/views/mainPage/components/AddToKgButton.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";
import BubbleOperationButtons from "@/views/mainPage/components/BubbleOperationButtons.vue";
import BubbleSuggestions from "@/views/mainPage/components/BubbleSuggestions.vue";
import BubbleReferences from "@/views/mainPage/components/BubbleReferences.vue";
import AIBubbleFooter from "@/views/mainPage/components/AIBubbleFooter.vue";
import AIBubbleThinkingStatus from "@/views/mainPage/components/AIBubbleThinkingStatus.vue";
import UserBubble from "@/views/mainPage/components/UserBubble.vue";
import AIBubble from "@/views/mainPage/components/AIBubble.vue";

export default {
  name: 'MessageBubble',
  components: {
    AIBubble,
    UserBubble,
    AIBubbleThinkingStatus,
    AIBubbleFooter,
    BubbleReferences,
    BubbleSuggestions,
    BubbleOperationButtons, MessageDialog, AddToKgButton, Markdown, ResponseSuggestion, FuncButton},
  props: {
    role: {type: String, required: true},
    message: {type: Object, required: true},
    messageId: {type: String, required: false},
    thinking: {type: Boolean, default: true},
    doDeleteMessage: {type: Function, required: true},
    doReAnswer: {type: Function, required: true},
    doSuggestion: {type: Function, required: true},
    doViewReferences: {type: Function, required: true},
    doAddMessageToKg: {type: Function, required: true},
    isLastMessage: {type: Boolean, default: false},
    simpleMode: {type: Boolean, default: false},
  },
}
</script>

<template>
  <div class="flex flex-col w-full my-3" :style="{alignItems: role === 'human' ? 'end' : 'start'}">
    <UserBubble v-if="role === 'human'" :content="message.content" :attachments="message.attachments"/>
    <AIBubble v-else :message="message" :message-id="messageId" :thinking="thinking"
              :simple-mode="simpleMode"
              :do-add-message-to-kg="doAddMessageToKg"
              :do-delete-message="doDeleteMessage"
              :do-re-answer="doReAnswer"
              :do-suggestion="doSuggestion"
              :is-last-message="isLastMessage"
              :do-view-references="(x) => doViewReferences(x)"/>
  </div>
</template>

<style scoped lang="scss">

</style>
