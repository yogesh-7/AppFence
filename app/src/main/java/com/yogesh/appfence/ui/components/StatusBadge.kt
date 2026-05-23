package com.yogesh.appfence.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.yogesh.appfence.model.AppStatus
import com.yogesh.appfence.ui.theme.AppFenceTheme
import com.yogesh.appfence.ui.theme.StatusAllowed
import com.yogesh.appfence.ui.theme.StatusBlocked
import com.yogesh.appfence.ui.theme.StatusDataOnly
import com.yogesh.appfence.ui.theme.StatusWifiOnly

/**
 * Colored badge showing the current access status of an app.
 * Animates color transitions when the status changes.
 */
@Composable
fun StatusBadge(
    status: AppStatus,
    modifier: Modifier = Modifier,
) {
    val backgroundColor by animateColorAsState(
        targetValue = when (status) {
            AppStatus.ALLOWED -> StatusAllowed
            AppStatus.WIFI_ONLY -> StatusWifiOnly
            AppStatus.DATA_ONLY -> StatusDataOnly
            AppStatus.BLOCKED -> StatusBlocked
        },
        animationSpec = tween(durationMillis = 300),
        label = "statusColor"
    )

    Text(
        text = status.label,
        style = MaterialTheme.typography.labelSmall,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.surface,
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(backgroundColor.copy(alpha = 0.9f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    )
}

@Preview
@Composable
fun StatusBadgePreview() {
    AppFenceTheme {
        Surface(
            color = MaterialTheme.colorScheme.background,
            modifier = Modifier.padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                AppStatus.entries.forEach { status ->
                    StatusBadge(status = status)
                }
            }
        }
    }
}
