import { ActionContext } from '@/context/ActionConext'
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect, useRef } from 'react'

const SandPackClient = () => {
    const previewRef = useRef()
    const {sandpack} = useSandpack()
    const {action,setAction} = useContext(ActionContext)

    useEffect(()=>{
        console.log("Btn Clicked in Sanpackclient")
        GetSandPackClient()
    },[sandpack && action])

    const GetSandPackClient =async ()=>{
        const client = await previewRef.current?.getClient()
        if(client){
            const result = await client.getCodeSandboxURL()
            console.log(result)
            if(action?.actionType === 'deploy'){
                window?.open(`https://${result?.sandboxId}.csb.app/`)
            }else if(action?.actionType === 'export'){
                window?.open(result?.editorUrl)
            }
        }
    }

  return (
    <div className='w-full h-full'>
        <SandpackPreview
        ref={previewRef}
        style={{ height: "80vh" }} showNavigator={true} />
    </div>
  )
}

export default SandPackClient