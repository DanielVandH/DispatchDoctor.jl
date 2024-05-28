var documenterSearchIndex = {"docs":
[{"location":"macros/#Reference","page":"Macros","title":"Reference","text":"","category":"section"},{"location":"macros/#Macros","page":"Macros","title":"Macros","text":"","category":"section"},{"location":"macros/","page":"Macros","title":"Macros","text":"The two main general utilities for working with quantities are ustrip and dimension:","category":"page"},{"location":"macros/","page":"Macros","title":"Macros","text":"@stable\n@unstable","category":"page"},{"location":"macros/#DispatchDoctor.@stable","page":"Macros","title":"DispatchDoctor.@stable","text":"@stable [warnonly=false] [code_block]\n\nA macro to enforce type stability in functions. When applied, it ensures that the return type of the function is concrete. If type instability is detected, a TypeInstabilityError is thrown. You may also pass warnonly=true to only emit a warning.\n\nUsage\n\nusing DispatchDoctor: @stable\n\n@stable function relu(x)\n    if x > 0\n        return x\n    else\n        return 0.0\n    end\nend\n\nExample\n\njulia> relu(1.0)\n1.0\n\njulia> relu(0)\nERROR: TypeInstabilityError: Instability detected in function `relu`\nwith arguments `(Int64,)`. Inferred to be `Union{Float64, Int64}`,\nwhich is not a concrete type.\n\nExtended help\n\nYou may also apply @stable to arbitrary blocks of code, such as begin or module, and have it be applied to all functions. (Just note that this skips closure functions.)\n\nusing DispatchDoctor: @stable\n\n@stable begin\n    f(x) = x\n    g(x) = x > 0 ? x : 0.0\n    @unstable begin\n        g(x::Int) = x > 0 ? x : 0.0\n    end\n    module A\n        h(x) = x\n        include(\"myfile.jl\")\n    end\nend\n\nThis @stable will apply to f, g, h, as well as all functions within myfile.jl. It skips the definition g(x::Int), meaning that when Int input is provided to g, type instability is not detected.\n\n\n\n\n\n","category":"macro"},{"location":"macros/#DispatchDoctor.@unstable","page":"Macros","title":"DispatchDoctor.@unstable","text":"@unstable [code_block]\n\nA no-op macro to hide blocks of code from @stable.\n\n\n\n\n\n","category":"macro"},{"location":"macros/#Utilities","page":"Macros","title":"Utilities","text":"","category":"section"},{"location":"macros/","page":"Macros","title":"Macros","text":"allow_unstable","category":"page"},{"location":"macros/#DispatchDoctor.allow_unstable","page":"Macros","title":"DispatchDoctor.allow_unstable","text":"allow_unstable(f::F) where {F<:Function}\n\nGlobally disable type DispatchDoctor instability checks within the provided function f.\n\nThis function allows you to execute a block of code where type instability checks are disabled. It ensures that the checks are re-enabled after the block is executed, even if an error occurs.\n\nThis function uses a ReentrantLock and will throw an error if used from two tasks at once.\n\nUsage\n\nallow_unstable() do\n    # do unstable stuff\nend\n\nArguments\n\nf::F: A function to be executed with type instability checks disabled.\n\nReturns\n\nThe result of the function f.\n\nNotes\n\nYou cannot call allow_unstable from two tasks at once. An error will be thrown if you try to do so.\n\n\n\n\n\n","category":"function"},{"location":"macros/#Internals","page":"Macros","title":"Internals","text":"","category":"section"},{"location":"macros/","page":"Macros","title":"Macros","text":"DispatchDoctor.type_instability","category":"page"},{"location":"macros/#DispatchDoctor.type_instability","page":"Macros","title":"DispatchDoctor.type_instability","text":"type_instability(T::Type)\n\nReturns true if this type is not concrete. Will also return false for Union{}, so that errors can propagate.\n\n\n\n\n\n","category":"function"},{"location":"#DispatchDoctor","page":"Home","title":"DispatchDoctor 🩺","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The doctor's orders: no type instability allowed!","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: Dev) (Image: Build Status) (Image: Coverage) (Image: Aqua QA) (Image: )","category":"page"},{"location":"#Usage","page":"Home","title":"Usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides the @stable macro to enforce that functions have type stable return values.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using DispatchDoctor: @stable\n\n@stable function relu(x)\n    if x > 0\n        return x\n    else\n        return 0.0\n    end\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"Calling this function will throw an error for any type instability:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> relu(1.0)\n1.0\n\njulia> relu(0)\nERROR: TypeInstabilityError: Instability detected in function `relu`\nwith arguments `(Int64,)`. Inferred to be `Union{Float64, Int64}`,\nwhich is not a concrete type.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Code which is type stable should safely compile away the check:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> @stable f(x) = x;","category":"page"},{"location":"","page":"Home","title":"Home","text":"with @code_llvm f(1):","category":"page"},{"location":"","page":"Home","title":"Home","text":"define i64 @julia_f_12055(i64 signext %\"x::Int64\") #0 {\ntop:\n  ret i64 %\"x::Int64\"\n}","category":"page"},{"location":"","page":"Home","title":"Home","text":"Meaning there is zero overhead on this type stability check.","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can also use @stable on blocks of code, including begin-end blocks, module, and anonymous functions. The inverse of @stable is @unstable which turns it off:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@stable begin\n\n    f() = rand(Bool) ? 0 : 1.0\n    f(x) = x\n\n    module A\n        # Will apply to code inside modules:\n        g(; a, b) = a + b\n\n        # Will recursively apply to included files:\n        include(\"myfile.jl\")\n\n        module B\n            # as well as nested submodules!\n\n            # `@unstable` inverts `@stable`:\n            using DispatchDoctor: @unstable\n            @unstable h() = rand(Bool) ? 0 : 1.0\n\n            # This can also apply to code blocks:\n            @unstable begin\n                h(x::Int) = rand(Bool) ? 0 : 1.0\n                # ^ And target specific methods\n            end\n        end\n    end\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"All methods in the block will be wrapped with the type stability check:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> f()\nERROR: TypeInstabilityError: Instability detected in function `f`.\nInferred to be `Union{Float64, Int64}`, which is not a concrete type.","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Tip: in the REPL, you must wrap modules with @eval, because the REPL has special handling of the module keyword.)","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can globally disable stability errors with the allow_unstable context:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> @stable f(x) = x > 0 ? x : 0.0\n\njulia> allow_unstable() do\n           f(1)\n       end\n1","category":"page"},{"location":"","page":"Home","title":"Home","text":"Instability errors are also skipped during precompilation.","category":"page"},{"location":"","page":"Home","title":"Home","text":"[!NOTE] @stable will have no effect on code if it is:Within an @unstable block\nWithin a macro\nA function inside another function (a closure)\nA generated function\nWithin an @eval statement\nWithin a quote block\nIf the function name is an expression (such as parameterized functions like MyType{T}(args...) = ...)You can safely use @stable over all of these cases, it will simply be ignored. Although, if you use @stable internally in any of these cases, (like calling @stable within a function on a closure), then it might still apply.Also, @stable has no effect on code in supported Julia versions.","category":"page"},{"location":"#Credits","page":"Home","title":"Credits","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Many thanks to @chriselrod and @thofma for tips on this discord thread.","category":"page"}]
}
