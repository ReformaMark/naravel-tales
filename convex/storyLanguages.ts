import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getstoryLanguages = query({
    args:{

    },
    handler: async(ctx, args) =>{
        const languages = await ctx.db.query("storyLanguages").collect();

        return languages;
    }
});

export const getstoryLanguageById = query({
    args:{
        languageId: v.optional(v.id('storyLanguages'))
    },
    handler: async(ctx, args) =>{
        if(!args.languageId) return null
        const language = await ctx.db.get(args.languageId)

        return language;
    }
});
export const create = mutation({
    args:{
        name: v.string()

    },
    handler: async(ctx, args) =>{
        const languages = await ctx.db.query('storyLanguages').collect()
        const isExisting = languages.find(lang => lang.name.toLowerCase() === args.name.toLowerCase())
        if(isExisting) {
            throw new ConvexError('The Language already exist.')
        }

        await ctx.db.insert('storyLanguages',{
            name: args.name
        })

        return "success";
    }
});

export const edit = mutation({
    args:{
        languageId: v.id('storyLanguages'),
        name: v.string()
      
    },
    handler: async(ctx, args) =>{
        if(!args.languageId) return null
        const language = await ctx.db.get(args.languageId)
        if(language === null) return
     
        if(language) {
           await ctx.db.patch(language._id,{
                name: args.name
           })
        }
        return "success";
    }
});

export const deleteLanguage = mutation({
    args:{
        languageId: v.id('storyLanguages'),
    },
    handler: async(ctx, args) =>{
        if(!args.languageId) return null
        const language = await ctx.db.get(args.languageId)
        if(language === null) return
        const stories = await ctx.db.query('stories').withIndex('by_languageId', q => q.eq('language', language._id)).collect()
        if(stories.length > 0) {
            throw new ConvexError(`Error: Cannot delete the language because it is associated with (${stories.length}) stories.`)
        }
        if(language) {
           await ctx.db.delete(language._id)
        }
        return "deleted";
    }
});

