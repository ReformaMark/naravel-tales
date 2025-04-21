import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";

export const getCategories = query({
    args:{

    },
    handler: async(ctx, args) =>{
        const categories = await ctx.db.query("storyCategories").collect();
        const categoriesWithImage = await asyncMap(categories, async (category) => {
         
            const image = category.imageId ? await ctx.storage.getUrl(category.imageId as Id<'_storage'>) : null;
            return {
                ...category,
                imageUrl: image,
            };
        }); 
        return categoriesWithImage;
    }
});

export const createStoryCategory = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        imageId: v.optional(v.string()),
    },
    handler: async(ctx, args) =>{
        const categories = await ctx.db.query("storyCategories").filter(q => q.eq(q.field("name"), args.name)).collect();
        if (categories.length > 0) {
            throw new Error("Category already exists");
        }
        const category = await ctx.db.insert("storyCategories", {
            ...args,
        });
        return category;
    }
});
export const getCategory = query({
    args: {
       categoryId: v.optional(v.id('storyCategories')),
    },
    handler: async(ctx, args) =>{
        if(!args.categoryId) return
        const category = await ctx.db.get(args.categoryId);
        if (!category) return
        const image = category.imageId ? await ctx.storage.getUrl(category.imageId as Id<'_storage'>) : null;
        return {
            ...category,
            imageUrl: image,
        };
      
    }
});

export const updateCategory = mutation({
    args: {
        categoryId: v.id('storyCategories'),
        name: v.string(),
        description: v.optional(v.string()),
        image: v.optional(v.string())
     },
     handler: async(ctx, args) =>{
         const category = await ctx.db.get(args.categoryId);
         if (!category) {
             throw new Error("Category not found");
         }
         if(!args.image) {
            await ctx.db.patch(category._id,{
                name: args.name,
                description: args.description,
                imageId: category.imageId,
            })
         } else {
            await ctx.db.patch(category._id,{
                name: args.name,
                description: args.description,
                imageId: args.image,
            })
         }
      
       
     }
});

export const deleteCategory = mutation({
    args: {
        categoryId: v.id('storyCategories'),
     },
     handler: async(ctx, args) =>{
         const category = await ctx.db.get(args.categoryId);
         if (!category) {
             throw new Error("Category not found");
         }
         const stories = await ctx.db.query('stories').filter(q => q.eq(q.field('categoryId'), category._id)).collect()
         if(stories.length >= 1) {
            throw new ConvexError(`Cannot delete category: there are ${stories.length} stories using this category`)
         }
         if(category.imageId) {
            await ctx.storage.delete(category.imageId as Id<'_storage'>)
            await ctx.db.delete(category._id)
            return "success"
         } else {
            await ctx.db.delete(category._id)
             return "success"
         }
     }
});


