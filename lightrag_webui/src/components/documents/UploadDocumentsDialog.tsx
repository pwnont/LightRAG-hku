import { useState, useCallback } from 'react'
import Button from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog'
import FileUploader from '@/components/ui/FileUploader'
import { toast } from 'sonner'
import { errorMessage } from '@/lib/utils'
import { uploadDocument } from '@/api/lightrag'
import Input from '@/components/ui/Input'
import Text from '@/components/ui/Text'

import { UploadIcon } from 'lucide-react'

export default function UploadDocumentsDialog() {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progresses, setProgresses] = useState<Record<string, number>>({})
  const [groupsText, setGroupsText] = useState<string>("")

  const handleDocumentsUpload = useCallback(
    async (filesToUpload: File[]) => {
      setIsUploading(true)
      const groups = groupsText
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g.length > 0)

      try {
        await Promise.all(
          filesToUpload.map(async (file) => {
            try {
              const result = await uploadDocument(file, (percentCompleted: number) => {
                console.debug(`Uploading ${file.name}: ${percentCompleted}%`)
                setProgresses((pre) => ({
                  ...pre,
                  [file.name]: percentCompleted
                }))
              }, groups)
              if (result.status === 'success') {
                toast.success(`Upload Success:\n${file.name} uploaded successfully`)
              } else {
                toast.error(`Upload Failed:\n${file.name}\n${result.message}`)
              }
            } catch (err) {
              toast.error(`Upload Failed:\n${file.name}\n${errorMessage(err)}`)
            }
          })
        )
      } catch (err) {
        toast.error('Upload Failed\n' + errorMessage(err))
      } finally {
        setIsUploading(false)
        // setOpen(false)
      }
    },
    [setIsUploading, setProgresses]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isUploading && !open) {
          return
        }
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" side="bottom" tooltip="Upload documents" size="sm">
          <UploadIcon /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload documents</DialogTitle>
          <DialogDescription>
            Drag and drop your documents here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFileCount={Infinity}
          maxSize={200 * 1024 * 1024}
          description="supported types: TXT, MD, DOCX, PDF, PPTX, RTF, ODT, EPUB, HTML, HTM, TEX, JSON, XML, YAML, YML, CSV, LOG, CONF, INI, PROPERTIES, SQL, BAT, SH, C, CPP, PY, JAVA, JS, TS, SWIFT, GO, RB, PHP, CSS, SCSS, LESS"
          onUpload={handleDocumentsUpload}
          progresses={progresses}
          disabled={isUploading}
        />
        <div className="flex flex-col gap-1">
          <Text text="Groups (comma-separated)" className="ml-1" />
          <Input
            placeholder="e.g. team-a, internal"
            value={groupsText}
            onChange={(e) => setGroupsText(e.target.value)}
            disabled={isUploading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
