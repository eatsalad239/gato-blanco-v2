package com.gatoblanco.cafe

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.google.androidbrowserhelper.trusted.TwaLauncher

class LauncherActivity : AppCompatActivity() {
    
    companion object {
        private const val SPLASH_DELAY = 2000L // 2 seconds
        private const val TWA_URL = "https://gatoblanco.cafe"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_launcher)
        
        // Handle splash screen and launch TWA
        Handler(Looper.getMainLooper()).postDelayed({
            launchTwa()
        }, SPLASH_DELAY)
    }
    
    private fun launchTwa() {
        val uri = Uri.parse(TWA_URL)
        val launcher = TwaLauncher(this)
        
        launcher.launch(
            uri,
            null, // Custom headers
            null, // Referrer
            Bundle() // Extra command line args
        )
        
        // Finish launcher activity
        finish()
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        // Handle deep links
        val data = intent?.data
        if (data != null) {
            val twaUri = when {
                data.scheme == "gatoblanco" -> Uri.parse("$TWA_URL${data.path}")
                data.host == "gatoblanco.cafe" -> data
                else -> Uri.parse(TWA_URL)
            }
            
            val launcher = TwaLauncher(this)
            launcher.launch(twaUri, null, null, Bundle())
            finish()
        }
    }
}