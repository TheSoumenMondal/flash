import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const workspace = mutation({
    args : {
        message : v.any(),
        user:v.id('users')
    },
    handler : async (ctx,args) => {
        const workspaceId = await ctx.db.insert('workspace',{
            message : args.message,
            user : args.user
        })
        return workspaceId
    }
})

export const getWorkSpace = query({
    args:{
        workspaceId : v.id("workspace")
    },
    handler : async (ctx,args) => {
        const workspace = await ctx.db.get(args.workspaceId)
        return workspace
    }
})


export const updateMessages = mutation({
    args : {
        workspaceId : v.id('workspace'),
        message : v.any(),
    },
    handler : async (ctx,args) => {
        const workspace = await ctx.db.get(args.workspaceId)
        if(!workspace) return
        const updatedWorkspace = await ctx.db.patch(args.workspaceId,{
            message : args.message
        })
        return updatedWorkspace
    }
})

export const UpdateFiles = mutation({
    args : {
        workspaceId : v.id('workspace'),
        files : v.any(),
    },
    handler : async (ctx,args) => {
        const workspace = await ctx.db.get(args.workspaceId)
        if(!workspace) return
        const updatedWorkspace = await ctx.db.patch(args.workspaceId,{
            fileData : args.files
        })
        return updatedWorkspace
    }
})



export const GetAllWorkspaces = query({
    args : {
        userId : v.optional(v.id('users'))
    },
    handler : async (ctx,args) => {
        const workspaces = await ctx.db.query('workspace').filter(q => q.eq(q.field('user'),args.userId)).collect()
        return workspaces
    }
})