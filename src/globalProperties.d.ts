//xxx.d.ts
export{} // 必须保留
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $articles:any
    }
}
