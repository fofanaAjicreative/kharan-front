<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const content = defineModel<string>({
  required: true
})

const editor = useEditor({

  content: content.value,

  extensions: [
    StarterKit
  ],

  onUpdate({ editor }) {

    content.value = editor.getHTML()

  }

})

  watch(content, (value) => {

    if (!editor.value) return

    if (value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, false)
    }

  })

onBeforeUnmount(() => {

  editor.value?.destroy()

})
</script>

<template>

  <div  class="main_content">

        <v-card
            rounded="4"
            variant="outlined"
           
            class="editor_card"
          >

            <v-toolbar
              density="compact"
              color="grey-lighten-5"
            >

              <v-btn
                icon="mdi-format-bold"
                variant="text"
                @click="editor?.chain().focus().toggleBold().run()"
              />

              <v-btn
                icon="mdi-format-italic"
                variant="text"
                @click="editor?.chain().focus().toggleItalic().run()"
              />

              <v-divider vertical class="mx-2"/>

              <v-btn
                icon="mdi-format-list-bulleted"
                variant="text"
                @click="editor?.chain().focus().toggleBulletList().run()"
              />

              <v-btn
                icon="mdi-format-list-numbered"
                variant="text"
                @click="editor?.chain().focus().toggleOrderedList().run()"
              />

            </v-toolbar>

          <editor-content
            :editor="editor"
            class="editor pa-4"
          />

        </v-card>

  </div>

</template>



<style scoped>

      .main_content{
          width : 100% 
      }

      .editor{
          min-height:150px;
      }

      :deep(.ProseMirror){
        outline:none;
        min-height:150px;
      }

      :deep(.ProseMirror p){
          margin:10px 0;
      }

      .editor_card{
        border: 1px #aaa solid ;
      }

</style>