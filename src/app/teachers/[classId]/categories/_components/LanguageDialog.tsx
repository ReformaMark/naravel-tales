'use client'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface LanguageDialogProp {
  languageDialog: boolean;
  setLanguageDialog: (value: boolean) => void;
  languageId?: Id<'storyLanguages'>;
  setLanguageId: (value: Id<'storyLanguages'> | undefined) => void;
}
interface LanguageTypes {
  id: Id<'storyLanguages'>,
  name: string
}
function LanguageDialog({
  languageDialog,
  setLanguageDialog,
  languageId,
  setLanguageId
}: LanguageDialogProp) {

  const [data, setData] = useState<LanguageTypes | undefined>()
  const language = useQuery(api.storyLanguages.getstoryLanguageById, {languageId:languageId})
  const saveLanguage = useMutation(api.storyLanguages.create)
  const editLanguage = useMutation(api.storyLanguages.edit)
  const deleteLanguage = useMutation(api.storyLanguages.deleteLanguage)

  useEffect(()=>{
    if(language) {
      setData({
        id: language._id,
        name: language.name
      })
    }
  },[language])

function handleOnOpenChange(value: boolean) {
  setLanguageDialog(value)
  if(value === false) {
    setLanguageId(undefined)
  }
  setData(undefined)
};

function handleSubmit(type: 'edit' | "add") {
  if(type === "add" && data) {
    toast.promise(saveLanguage({
      name: data?.name.trim()
    }),{
      loading: 'Saving Language...',
      success: 'Language saved successfully.',
      error: (data) => {
        const error = data ? data.data : "Error adding new language"
        return error
       }
    })
    setData(undefined)
    setLanguageId(undefined)
    setLanguageDialog(false)
  }
  if(type === "edit" && languageId && data) {
    toast.promise(editLanguage({
      languageId: languageId,
      name: data?.name.trim()
    }),{
      loading: 'Updating Language...',
      success: 'Language updated successfully.',
      error: (data) => {
        const error = data ? data.data : "Error updating language."
        return error
       }
    })
    setData(undefined)
    setLanguageId(undefined)
    setLanguageDialog(false)
  }
};

function handleDelete() {
  if(languageId && data) {
    toast.promise(deleteLanguage({
      languageId: languageId,
    }),{
      loading: 'Deleting Language...',
      success: 'Language deleted successfully.',
      error: (data) => {
        const error = data ? data.data : "Error deleting language."
        return error
      }
    })
  }
  setData(undefined)
  setLanguageId(undefined)
  setLanguageDialog(false)
}
  return ( 
    <Dialog open={languageDialog} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogTitle>
          {language !== null ? "Edit Language" : "Add New Language"}
        </DialogTitle>
        <div className="">
          <Input
            value={data ? data.name : ""}  
            onChange={(event) => setData(prev => ({ ...prev, name: event.target.value } as LanguageTypes))}
            className=''
            />
        </div>
        <DialogFooter>
          {language && (
            <Button variant={'destructive'} onClick={handleDelete} className=''><Trash2/></Button>

          )}
          <Button variant={'secondary'} onClick={()=>handleOnOpenChange(false)} className=''>Cancel</Button>
          {language ? ( 
            <Button onClick={() =>{handleSubmit('edit')}} className=''>Save</Button>
          ) : (
            <Button onClick={() =>{handleSubmit("add")}} className=''>Save</Button>
          )}
       
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LanguageDialog