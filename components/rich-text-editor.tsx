"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  ImageIcon,
  X,
  Check,
  Table as TableIcon,
  Undo,
  Redo,
  Trash2,
} from "lucide-react"
import { uploadImage } from "@/lib/storage"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/components/ui/use-toast"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder = "İçerik yazın...", className }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const { toast } = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit içinde zaten bulunan liste uzantılarını kullanıyoruz
        // Bu şekilde çakışma önleniyor
        orderedList: true,
        bulletList: true,
        listItem: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const addLink = () => {
    if (!linkUrl) return

    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    setLinkUrl("")
    setIsAddingLink(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    try {
      setIsUploadingImage(true)
      const url = await uploadImage(file)

      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
        toast({
          title: "Görsel yüklendi",
          description: "Görsel başarıyla editöre eklendi.",
        })
      } else {
        throw new Error("Görsel yüklenemedi.")
      }
    } catch (error) {
      console.error("Görsel yükleme hatası:", error)
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      // Input değerini sıfırla ki aynı dosyayı tekrar seçebilsin
      e.target.value = ""
    }
  }

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (!editor) return

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    if (files.length === 0) return

    try {
      setIsUploadingImage(true)
      for (const file of files) {
        const url = await uploadImage(file)
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      }
      toast({
        title: "Görsel yüklendi",
        description: `${files.length} görsel başarıyla eklendi.`,
      })
    } catch (error) {
      console.error("Görsel yükleme hatası:", error)
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
      toast({
        title: "Görsel yüklendi",
        description: "Görsel başarıyla editöre eklendi.",
      })
    }
    setIsAddingImage(false)
  }

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn("border rounded-md", className)} onDragOver={(e) => e.preventDefault()} onDrop={handleImageDrop}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20">
        <TooltipProvider delayDuration={300}>
          {/* Temel Metin Formatları */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-muted" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kalın</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-muted" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>İtalik</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive("underline") ? "bg-muted" : ""}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Altı Çizili</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Listeler */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Madde İşaretleri</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive("orderedList") ? "bg-muted" : ""}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numaralı Liste</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Hizalama */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sola Hizala</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ortala</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sağa Hizala</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Başlıklar */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Başlık 1</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Başlık 2</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Başlık 3</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Tablo */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addTable}
                  className={editor.isActive("table") ? "bg-muted" : ""}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablo Ekle</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Geri/İleri */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Geri Al</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yinele</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Bağlantı ve Görsel */}
          <div className="flex items-center gap-1">
            <Popover open={isAddingLink} onOpenChange={setIsAddingLink}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className={editor.isActive("link") ? "bg-muted" : ""}>
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Bağlantı Ekle</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link">Bağlantı URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="link"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingLink(false)}>
                      <X className="h-4 w-4 mr-1" /> İptal
                    </Button>
                    <Button type="button" size="sm" onClick={addLink}>
                      <Check className="h-4 w-4 mr-1" /> Ekle
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={isAddingImage} onOpenChange={setIsAddingImage}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Görsel Ekle</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-96">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label>Görsel Yükle</Label>
                    <ImageUpload onImageUploaded={handleImageUploaded} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingImage(false)}>
                      <X className="h-4 w-4 mr-1" /> İptal
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TooltipProvider>
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor, state }) => {
            return !editor.isActive("image")
          }}
        >
          <div className="flex bg-background border rounded-md shadow-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-muted" : ""}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const url = window.prompt("URL")
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              className={editor.isActive("link") ? "bg-muted" : ""}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  )
}
