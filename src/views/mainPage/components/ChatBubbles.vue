<script>
import MessageBubble from "@/views/mainPage/components/MessageBubble.vue";

export default {
  name: "ChatBubbles",
  components: {MessageBubble},
  props: {
    answerStatus: {type: String, required: true},
    chatMessages: {type: Array, required: true},
    doAddMessageToKg: {type: Function, required: true},
    doDeleteMessage: {type: Function, required: true},
    doReAnswer: {type: Function, required: true},
    doSuggestion: {type: Function, required: false},
    doViewReferences: {type: Function, required: false},
    simpleMode: {type: Boolean, default: false},
  },
  methods: {
  },
}
</script>

<template>
  <div
       class="w-full mt-[24px] flex flex-col items-center">
    <MessageBubble v-for="(messageItem, index) in chatMessages" :key="messageItem.messageUniqueId"
                   :simple-mode="simpleMode"
                   :role="messageItem.role"
                   :message="messageItem.content"
                   :message-id="messageItem.messageUniqueId"
                   :thinking="chatMessages.length === 1 ? answerStatus !== 'idle' : (index === chatMessages.length - 1 && answerStatus !== 'idle')"
                   :do-add-message-to-kg="doAddMessageToKg"
                   :do-delete-message="doDeleteMessage"
                   :do-re-answer="doReAnswer"
                   :do-suggestion="doSuggestion"
                   :isLastMessage="index === chatMessages.length - 1"
                   :do-view-references="(messageId) => doViewReferences(messageId)"/>
  </div>
</template>

<style scoped lang="scss">

</style>
